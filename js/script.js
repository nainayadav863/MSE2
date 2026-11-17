document.addEventListener("DOMContentLoaded", function () {
  var counters = document.querySelectorAll(".counter-number");
  if (counters.length) {
    counters.forEach(function (c) {
      var target = parseInt(c.getAttribute("data-target"), 10);
      var pfx = c.getAttribute("data-prefix") || "";
      var count = 0, step = Math.ceil(target / 40);
      var timer = setInterval(function () {
        count += step;
        if (count >= target) { count = target; clearInterval(timer); }
        c.textContent = pfx + count.toLocaleString();
      }, 40);
    });
  }

  var progressBars = document.querySelectorAll(".progress-fill");
  if (progressBars.length) {
    setTimeout(function () {
      progressBars.forEach(function (b) {
        var p = b.getAttribute("data-percentage");
        if (p) b.style.width = p + "%";
      });
    }, 200);
  }

  var quickBtns = document.querySelectorAll(".quick-btn");
  var customAmount = document.getElementById("customAmount");
  var donateBtn = document.getElementById("donateSubmitBtn");
  var donateForm = document.getElementById("donationForm");
  var receiptBox = document.getElementById("receiptBox");

  function updateBtn(v) {
    if (donateBtn) donateBtn.textContent = v && v > 0 ? "Complete Donation of $" + v : "Complete Donation";
  }

  quickBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      quickBtns.forEach(function (x) { x.classList.remove("active"); });
      this.classList.add("active");
      var a = this.getAttribute("data-amount");
      if (customAmount) { customAmount.value = a; customAmount.classList.remove("input-invalid"); }
      updateBtn(a);
    });
  });

  if (customAmount) {
    customAmount.addEventListener("input", function () {
      var v = this.value;
      quickBtns.forEach(function (b) {
        b.classList.toggle("active", b.getAttribute("data-amount") === v);
      });
      updateBtn(v);
    });
  }

  if (donateForm) {
    donateForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var amt = customAmount ? parseFloat(customAmount.value) : 0;
      var name = document.getElementById("donorName");
      var email = document.getElementById("donorEmail");
      var valid = true;

      document.getElementById("amountError").style.display = (!amt || amt <= 0) ? "block" : "none";
      if (!amt || amt <= 0) { customAmount.classList.add("input-invalid"); valid = false; }
      else customAmount.classList.remove("input-invalid");

      document.getElementById("donorNameError").style.display = (!name || name.value.trim().length < 2) ? "block" : "none";
      if (!name || name.value.trim().length < 2) { name.classList.add("input-invalid"); valid = false; }
      else name.classList.remove("input-invalid");

      var emailBad = !email || email.value.indexOf("@") === -1 || email.value.indexOf(".") === -1;
      document.getElementById("donorEmailError").style.display = emailBad ? "block" : "none";
      if (emailBad) { email.classList.add("input-invalid"); valid = false; }
      else email.classList.remove("input-invalid");

      if (valid && receiptBox) {
        var sel = document.getElementById("causeSelect");
        var cName = sel ? sel.options[sel.selectedIndex].text : "General Fund";
        receiptBox.innerHTML = "<h4>Donation Receipt & Confirmation</h4><div class=\"receipt-details\"><p><strong>Status:</strong> Successful</p><p><strong>Receipt ID:</strong> HLF-" + Math.floor(100000 + Math.random() * 900000) + "</p><p><strong>Donor:</strong> " + name.value.trim() + "</p><p><strong>Email:</strong> " + email.value.trim() + "</p><p><strong>Amount:</strong> $" + amt.toFixed(2) + "</p><p><strong>Cause:</strong> " + cName + "</p><p><strong>Tax Benefit:</strong> Section 80G / 501(c)(3) Eligible</p></div>";
        receiptBox.style.display = "block";
        receiptBox.scrollIntoView({ behavior: "smooth" });
        donateForm.reset();
        quickBtns.forEach(function (b) { b.classList.remove("active"); });
        updateBtn(0);
      }
    });
  }

  var volForm = document.getElementById("volunteerForm");
  var volSuccess = document.getElementById("volunteerSuccess");
  if (volForm) {
    volForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("volName");
      var email = document.getElementById("volEmail");
      var phone = document.getElementById("volPhone");
      var city = document.getElementById("volCity");
      var role = document.getElementById("volRole");
      var terms = document.getElementById("volTerms");
      var valid = true;

      function check(field, errId, condition) {
        var err = document.getElementById(errId);
        if (err) err.style.display = condition ? "none" : "block";
        if (field && field.classList) field.classList.toggle("input-invalid", !condition);
        if (!condition) valid = false;
      }

      check(name, "volNameError", name && name.value.trim().length >= 3);
      check(email, "volEmailError", email && email.value.indexOf("@") !== -1 && email.value.indexOf(".") !== -1);
      check(phone, "volPhoneError", phone && phone.value.replace(/[^0-9]/g, "").length >= 10);
      check(city, "volCityError", city && city.value.trim().length >= 2);
      check(role, "volRoleError", role && role.value !== "");
      check(terms, "volTermsError", terms && terms.checked);

      if (valid && volSuccess) {
        volSuccess.innerHTML = "<strong>Application Submitted!</strong><br>Thank you, " + name.value.trim() + ". We will contact you within 2 business days.";
        volSuccess.style.display = "block";
        volSuccess.scrollIntoView({ behavior: "smooth" });
        volForm.reset();
      }
    });
  }

  var filters = document.querySelectorAll(".filter-btn");
  var items = document.querySelectorAll(".gallery-item");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filters.forEach(function (b) { b.classList.remove("active"); });
      this.classList.add("active");
      var f = this.getAttribute("data-filter");
      items.forEach(function (it) {
        it.style.display = (f === "all" || it.getAttribute("data-category") === f) ? "block" : "none";
      });
    });
  });

  var modal = document.getElementById("lightboxModal");
  var mImg = document.getElementById("lightboxImg");
  var mTitle = document.getElementById("lightboxTitle");
  var mDesc = document.getElementById("lightboxDesc");
  var mCount = document.getElementById("lightboxCounter");
  var curIdx = 0, vis = [];

  function getVis() {
    vis = [];
    items.forEach(function (it) { if (it.style.display !== "none") vis.push(it); });
  }

  function show(idx) {
    if (!vis.length) return;
    if (idx < 0) idx = vis.length - 1;
    if (idx >= vis.length) idx = 0;
    curIdx = idx;
    var el = vis[curIdx];
    var img = el.querySelector("img");
    if (mImg && img) { mImg.src = img.src; mImg.alt = img.alt; }
    if (mTitle) mTitle.textContent = el.getAttribute("data-title") || "";
    if (mDesc) mDesc.textContent = el.getAttribute("data-desc") || "";
    if (mCount) mCount.textContent = "Photo " + (curIdx + 1) + " of " + vis.length;
    if (modal) modal.classList.add("show");
  }

  function hide() { if (modal) modal.classList.remove("show"); }

  items.forEach(function (it) {
    it.addEventListener("click", function () {
      getVis();
      var i = vis.indexOf(this);
      if (i !== -1) show(i);
    });
  });

  var cBtn = document.getElementById("lightboxClose");
  var pBtn = document.getElementById("lightboxPrev");
  var nBtn = document.getElementById("lightboxNext");

  if (cBtn) cBtn.addEventListener("click", hide);
  if (pBtn) pBtn.addEventListener("click", function (e) { e.stopPropagation(); show(curIdx - 1); });
  if (nBtn) nBtn.addEventListener("click", function (e) { e.stopPropagation(); show(curIdx + 1); });
  if (modal) modal.addEventListener("click", function (e) { if (e.target === modal) hide(); });

  document.addEventListener("keydown", function (e) {
    if (modal && modal.classList.contains("show")) {
      if (e.key === "Escape") hide();
      else if (e.key === "ArrowLeft") show(curIdx - 1);
      else if (e.key === "ArrowRight") show(curIdx + 1);
    }
  });

  var contactForm = document.getElementById("quickContactForm");
  var contactStatus = document.getElementById("contactStatus");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var n = document.getElementById("contactName").value.trim();
      var em = document.getElementById("contactEmail").value.trim();
      var msg = document.getElementById("contactMessage").value.trim();
      if (!n || !em || !msg) {
        contactStatus.textContent = "Please fill in all fields.";
        contactStatus.className = "status-message status-error";
        contactStatus.style.display = "block";
        return;
      }
      contactStatus.textContent = "Thank you, " + n + "! Your message has been sent.";
      contactStatus.className = "status-message status-success";
      contactStatus.style.display = "block";
      contactForm.reset();
    });
  }
});
