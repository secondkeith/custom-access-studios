"use strict";
const form = document.querySelector("#starting-note");
if (form) form.querySelector('button[type="submit"]').disabled = false;
if (form)
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const wish = document.querySelector("#wish");
    const important = document.querySelector("#important");
    const status = document.querySelector("#note-status");
    if (!wish.value.trim()) {
      status.textContent =
        "Add a thought about what you would like to make easier first.";
      wish.setAttribute("aria-invalid", "true");
      wish.setAttribute("aria-describedby", "note-status");
      wish.focus();
      return;
    }
    wish.removeAttribute("aria-invalid");
    const text =
      "MY STARTING NOTE\nCustom Access Studios\n\nI would like to make this easier:\n" +
      wish.value.trim() +
      "\n\nWhat matters most to me:\n" +
      (important.value.trim() || "Not added yet.") +
      "\n\nThis note was created on my device. It has not been sent to Custom Access Studios.\n";
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-starting-note.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent =
      "Your download has started. Nothing was sent to Emily. You can edit your thoughts and save another copy.";
  });
