document.addEventListener("DOMContentLoaded", function () {
  const dropbox = document.getElementById("dropbox");
  const textForm = document.getElementById("text-form");
  const submitBtn = document.getElementById("submit-btn");
  const loadingIcon = document.getElementById("loading-icon");
  loadingIcon.style.display = "none";
  const submitLoader = document.getElementById("submit-loader");
  const inputTextContainer = document.getElementById("input-text");
  let uploadedFile = null;
  var checkembed = false;

  dropbox.addEventListener("dragenter", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropbox.classList.add("dragover");
  });

  dropbox.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropbox.classList.add("dragover");
  });

  dropbox.addEventListener("dragleave", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropbox.classList.remove("dragover");
  });

  dropbox.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropbox.classList.remove("dragover");

    const files = e.dataTransfer.files;
    handleUploadedFiles(files);
  });

  dropbox.addEventListener("click", () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf";
    fileInput.addEventListener("change", (e) => {
      const files = e.target.files;
      handleUploadedFiles(files);
    });

    fileInput.click();
  });

  textForm.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault(); // Prevent the default form submission
      submitBtn.click(); // Programmatically click the submit button
    }
  });


  function handleUploadedFiles(files) {
    if (files.length > 0) {
      loadingIcon.style.display = 'inline-block';
      submitLoader.style.display = "inline-block";
      Array.from(files).forEach((file) => {
        if (file.type === "application/pdf") {
          uploadedFile = file; // Store the uploaded file data
          const reader = new FileReader();

          reader.onload = function (e) {
            const pdfUrl = URL.createObjectURL(file);

            const pdfIframe = document.getElementById("pdf-iframe");
            pdfIframe.src = pdfUrl;

            const formData = new FormData();
            formData.append("pdf_file_1", uploadedFile);

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/summerize_files", true);
            xhr.onreadystatechange = function () {
              if (xhr.readyState === XMLHttpRequest.DONE) {
                loadingIcon.style.display = "none"; // Hide the loading icon
                if (xhr.status === 200) {
                  const response = JSON.parse(xhr.responseText);
                  const summaryDiv = document.getElementById("summary");
                  const summaryText = document.createTextNode(response);
                  summaryDiv.innerHTML = ""; // Clear previous content
                  summaryDiv.appendChild(summaryText);

                  const formData1 = new FormData();
                  formData1.append("pdf_file_1", uploadedFile);

                  const xhr1 = new XMLHttpRequest();
                  xhr1.open("POST", "/embedding_RC", true);
                  xhr1.onreadystatechange = function () {
                    if (xhr1.readyState === XMLHttpRequest.DONE) {
                      submitLoader.style.display = "none";
                      if (xhr1.status === 200) {
                        const response = JSON.parse(xhr1.responseText);
                        checkembed=true;
                      }
                      else {
                        alert("Something went wrong. Please refresh and try again");
                      }
                    }
                  };
                  xhr1.send(formData1);
                }
                else {
                  alert("Something went wrong. Please refresh and try again");
                }
              } else {
                loadingIcon.style.display = "inline-block";
              }
            };
            xhr.send(formData);
          };

          reader.readAsDataURL(file);
        }
      });
      // document.querySelector(".container").classList.add("uploaded");
    }
  }

  submitBtn.addEventListener("click", () => {
    const inputText = document.getElementById("input-text").value;

    if (uploadedFile && inputText && checkembed) {
      inputTextContainer.disabled = true;
      submitBtn.disabled = true;
      submitLoader.style.display = "inline-block";
      const formData = new FormData();
      formData.append("input_text", inputText);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/QnA_in_RC", true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          loadingIcon.style.display = "none"; // Hide the loading icon

          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const conversationContainer = document.getElementById("conversation-container");
            conversationContainer.innerHTML = "";

            // Iterate over the response array in reverse order
            for (let i = 0; i < response.length; i++) {
              const item = response[i];
              const content = item[0];
              const sender = item[1];
              const messageContainer = document.createElement("div");
              const image = document.createElement("img");
              const textContent = document.createElement("div");
              const contentLines = content.split("\n");
              const formattedContent = contentLines.map((line, index) => {
                return line + "<br>";
              }).join("");
              // textContent.innerHTML = formattedContent;
              function appendTextWithAnimation(targetElement, text, delay) {
                let index = 0;
                const interval = setInterval(function () {
                  if (text[index] === "<") {
                    // If the current character is '<', look for the closing '>'
                    const endIndex = text.indexOf(">", index);
                    if (endIndex !== -1) {
                      targetElement.innerHTML += text.substring(index, endIndex + 1);
                      index = endIndex + 1;
                    }
                  } else {
                    targetElement.innerHTML += text[index];
                    index++;
                  }

                  if (index === text.length) {
                    clearInterval(interval);
                  }
                }, delay);
              }

              // Append content with animation to textContent
              if (i === response.length - 1) {
                appendTextWithAnimation(textContent, formattedContent, 15);
              }
              else {
                textContent.innerHTML = formattedContent;
              }
              textContent.style = "margin-right:30px; margin-left:20px; margin-top:20px;";
              // Add appropriate CSS class to the message container
              if (sender === "user") {
                image.src = "static/User.png";
                messageContainer.classList.add("user", "chat-message");
              } else {
                image.src = "static/System.png";
                messageContainer.classList.add("bot", "chat-message");
              }

              image.style = "max-height: 78px; max-width: 78px; border-radius: 50%; object-fit: cover;";
              messageContainer.style.display = "flex";
              messageContainer.appendChild(image);
              messageContainer.appendChild(textContent);
              conversationContainer.appendChild(messageContainer);
            }

            inputTextContainer.disabled = false;
            submitBtn.disabled = false;
            submitLoader.style.display = "none";
            textForm.reset();
          } else {
            alert("Something went wrong. Please refresh and try again");
            inputTextContainer.disabled = false;
            submitBtn.disabled = false;
            textForm.reset();
          }
        } else {
          loadingIcon.style.display = "inline-block";
        }
      };
      xhr.send(formData);
    }
  });
});