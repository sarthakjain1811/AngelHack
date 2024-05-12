(function() {
    var a = !0;
    window.onfocus = window.onblur = function(b) {
      a = "focus" === (b || event).type
    };
    var b = document.createEvent("Event");
    b.initEvent("ajaxUpdated", !0, !0);
    var c = function() {
        a && 4 === this.readyState && 200 === this.status && document.dispatchEvent(b)
      },
      d = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function() {
      arguments.callee.caller;
      return this.addEventListener("readystatechange", c, !0), d.apply(this, [].slice.call(arguments))
    }
  })()
  
  /***Thermostat/Range Slider***/
  /* Code by Steven Estrella. http://www.shearspiremedia.com */
  /* we need to change slider appearance oninput and onchange */
  function showValue(val, slidernum, vertical) {
    /* setup variables for the elements of our slider */
    var thumb = document.getElementById("sliderthumb" + slidernum);
    var shell = document.getElementById("slidershell" + slidernum);
    var track = document.getElementById("slidertrack" + slidernum);
    var fill = document.getElementById("sliderfill" + slidernum);
    var rangevalue = document.getElementById("slidervalue" + slidernum);
    var slider = document.getElementById("slider" + slidernum);
  
    var pc = val / (slider.max - slider.min); /* the percentage slider value */
    var thumbsize = 40; /* must match the thumb size in your css */
    var bigval = 250; /* widest or tallest value depending on orientation */
    var smallval = 40; /* narrowest or shortest value depending on orientation */
    var tracksize = bigval - thumbsize;
    var fillsize = 16;
    var filloffset = 10;
    var bordersize = 1;
    var loc = vertical ? (1 - pc) * tracksize : pc * tracksize;
    var degrees = 360 * pc;
    var rotation = "rotate(" + degrees + "deg)";
  
    rangevalue.innerHTML = val;
  
    thumb.style.webkitTransform = rotation;
    thumb.style.MozTransform = rotation;
    thumb.style.msTransform = rotation;
  
    fill.style.opacity = pc + 0.2 > 1 ? 1 : pc + 0.2;
  
    rangevalue.style.top = (vertical ? loc : 0) + "px";
    rangevalue.style.left = (vertical ? 2 : loc) + "px";
    thumb.style.top = (vertical ? loc : 0) + "px";
    thumb.style.left = (vertical ? 2 : loc) + "px";
    fill.style.top = (vertical ? loc + (thumbsize / 2) : filloffset + bordersize) + "px";
    fill.style.left = (vertical ? filloffset + bordersize : 0) + "px";
    fill.style.width = (vertical ? fillsize : loc + (thumbsize / 2)) + "px";
    fill.style.height = (vertical ? bigval - filloffset - fillsize - loc : fillsize) + "px";
    shell.style.height = (vertical ? bigval : smallval) + "px";
    shell.style.width = (vertical ? smallval : bigval) + "px";
    track.style.height = (vertical ? bigval - 4 : fillsize) + "px"; /* adjust for border */
    track.style.width = (vertical ? fillsize : bigval - 4) + "px"; /* adjust for border */
    track.style.left = (vertical ? filloffset + bordersize : 0) + "px";
    track.style.top = (vertical ? 0 : filloffset + bordersize) + "px";
  }
  /* we often need a function to set the slider values on page load */
  function setValue(val, num, vertical) {
    document.getElementById("slider" + num).value = val;
    showValue(val, num, vertical);
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    setValue(50, 3, true);
  });
  
  /***Electricity use chart***/
  var ctx = document.getElementById("electricityUsage");
  var electricityUsage = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [{
        label: 'kWh',
        fill: true,
        lineTension: 0.125,
        backgroundColor: "rgba(84,84,205,.25)",
        borderColor: "rgba(84,84,205,.8)",
        borderCapStyle: 'round',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "rgba(84,84,205,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(58,158,195,1)",
        pointHoverBorderColor: "rgba(84,84,205,1)",
        pointHoverBorderWidth: 1,
        pointRadius: 1,
        pointHitRadius: 2,
        pointStyle: "circle",
        data: [18, 15, 12, 10, 14, 16]
      }]
    },
    options: {
      responsive: true,
      legend: {
        labels: {
          fontFamily: "Lato",
          fontSize: 14
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
  
  /***Water Usage Chart***/
  var ctx = document.getElementById("waterUsage");
  var waterUsage = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [{
        label: 'Gallons',
        backgroundColor: "rgba(30,138,164,.5)",
        borderColor: "rgba(30,138,164,1)",
        borderWidth: 1,
        data: [10, 9, 11, 8, 10, 8]
      }]
    },
    options: {
      responsive: true,
      legend: {
        labels: {
          fontFamily: "Lato",
          fontSize: 14
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
  
  (function() {
    // initialize all
    [].slice.call(document.querySelectorAll('.si-icons .si-icons-easing > .si-icon')).forEach(function(el) {
      var svgicon = new svgIcon(el, svgIconConfig);
    });
  
    new svgIcon(document.querySelector('.si-icons-easing .si-icon-temp'), svgIconConfig, {
      easing: mina.elastic,
      speed: 600
    });
    new svgIcon(document.querySelector('.si-icons-easing .si-icon-lamp'), svgIconConfig, {
      easing: mina.elastic,
      speed: 600
    });
    new svgIcon(document.querySelector('.si-icons-easing .si-icon-bolt'), svgIconConfig, {
      easing: mina.elastic,
      speed: 600
    });
    new svgIcon(document.querySelector('.si-icons-easing .si-icon-plumbing'), svgIconConfig, {
      easing: mina.elastic,
      speed: 600
    });
  
  })();