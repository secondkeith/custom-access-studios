"use strict";
(() => {
  const form = document.querySelector("#starting-note");
  if (!form) return;
  const $ = (selector) => document.querySelector(selector);
  const wish = $("#wish");
  const important = $("#important");
  const status = $("#note-status");
  const examples = {
    reach: {
      question: "“I just want to reach my favourite mug.”",
      caption: "Start with the routine, not a shopping list.",
      clarify:
        "Which shelf is awkward? What feels comfortable to reach? What would you like to keep where it is?",
      productTitle: "A different kind of storage",
      productCopy:
        "Reorganised shelves or a pull-down fitting might help. A supplier can explain dimensions, load limits, and upkeep.",
      specialistTitle: "A conversation with a cabinetmaker",
      specialistCopy:
        "If an off-the-shelf fitting doesn’t suit, a cabinetmaker could explore a change to the cupboard.",
      caution:
        "Fit, comfortable operation, and safe installation need checking. These are avenues to explore, not a product recommendation.",
      wish: "I’d like to reach my everyday mugs without struggling with a high cupboard.",
      takeaway:
        "Could a change to storage help, and who could check the fit and installation?",
    },
    lighting: {
      question: "“I’d like to turn the light on from here.”",
      caption: "Start with where you are, not where the switch is.",
      clarify:
        "Where do you use the light? What feels easiest to operate? Would you prefer a solution without an app?",
      productTitle: "A control that comes to you",
      productCopy:
        "A compatible remote or plug-in lighting control may be an option. Check ease of use and what happens when Wi-Fi or power is unavailable.",
      specialistTitle: "An electrician’s perspective",
      specialistCopy:
        "For changes to fixed wiring or switch positions, a qualified electrician can assess what’s suitable and safely install it.",
      caution:
        "Compatibility, electrical safety, and a usable backup need checking. These are possibilities, not instructions to alter wiring.",
      wish: "I’d like to control the light comfortably from where I sit, without a complicated app.",
      takeaway:
        "Is there a simple compatible control, and would a qualified electrician need to be involved?",
    },
    doorway: {
      question: "“This doorway makes me think twice.”",
      caption: "Start with the part of the journey that gets in the way.",
      clarify:
        "Is it the handle, the threshold, or the space to move? What do you want to be able to carry or use through the doorway?",
      productTitle: "Hardware worth asking about",
      productCopy:
        "Different door hardware may be worth exploring. A supplier can explain how it operates and whether it fits the existing door.",
      specialistTitle: "Someone to assess the whole route",
      specialistCopy:
        "A suitably qualified access professional or building specialist can assess clearance, thresholds, and the implications of any alteration.",
      caution:
        "A doorway is part of a wider route. Safe access, building requirements, and any structural changes need professional assessment.",
      wish: "I’d like to move through a familiar doorway more comfortably.",
      takeaway:
        "What is making this route difficult, and which qualified professional should assess it before changes are made?",
    },
  };
  const summaries = {
    reach: { label: "01 / Reach", need: "Reach a favourite mug.", clarify: "What is awkward, and what should stay?", routes: "Storage options or a cabinetmaker.", people: "A storage supplier; a cabinetmaker if an alteration needs exploring." },
    lighting: { label: "02 / Lighting", need: "Turn on a light from where I sit.", clarify: "Which controls feel simple to use?", routes: "Compatible controls or an electrician.", people: "A lighting supplier; a qualified electrician for fixed wiring or switch changes." },
    doorway: { label: "03 / Doorway", need: "Move through a familiar doorway.", clarify: "The handle, the threshold, or the space?", routes: "Hardware options or a professional access assessment.", people: "A hardware supplier; a qualified access professional or building specialist." }
  };
  const questions = $("#questions");
  const people = $("#people");
  const inputs = [wish, important, questions, people];
  const dialog = $("#example-confirm");
  let selected = "reach";
  let carried = null;
  let pending = null;
  let returnFocus = null;
  if (matchMedia("(min-width: 721px)").matches) {
    $("#example-details").open = true;
    $("#review-note").open = true;
  }
  function updatePreview() {
    const previews = ["#preview-wish", "#preview-important", "#preview-question", "#preview-people"];
    const empty = ["Your everyday moment will appear here.", "The things you want to keep in mind.", "Your questions will appear here.", "People or roles to ask about."];
    inputs.forEach((input, index) => {
      $(previews[index]).textContent = input.value.trim() || empty[index];
      $(previews[index]).classList.toggle("empty", !input.value.trim());
    });
    if (!inputs.some(input => input.value.trim())) carried = null;
    $("#note-scenario").textContent = carried ? `${summaries[carried].label} · Your editable conversation sheet` : "Your own starting point";
    if (wish.value.trim()) wish.removeAttribute("aria-invalid");
  }
  const fields = {
    "#example-question": "question",
    "#scene-caption": "caption",
    "#clarify": "clarify",
    "#product-title": "productTitle",
    "#product-copy": "productCopy",
    "#specialist-title": "specialistTitle",
    "#specialist-copy": "specialistCopy",
    "#example-caution": "caution",
  };
  document.querySelectorAll("[data-example]").forEach((button) => {
    button.addEventListener("click", () => {
      selected = button.dataset.example;
      document
        .querySelectorAll("[data-example]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item.dataset.example === selected)),
        );
      Object.entries(fields).forEach(([selector, key]) => {
        $(selector).textContent = examples[selected][key];
      });
      $("#overview-scenario").textContent = summaries[selected].label;
      ["need", "clarify", "routes"].forEach(key => $("#overview-" + key).textContent = summaries[selected][key]);
      $("#use-example").textContent = `Use ${selected} as a starting point ↘`;
      // Browsing never mutates the note. Import is a separate, explicit action.
      if (button.closest(".example-repeat")) {
        $("#example-details").open = false;
        document.querySelector(`.example-controls [data-example="${selected}"]`).focus();
      }
      document.querySelectorAll("[data-scene]").forEach((scene) => {
        scene.hidden = scene.dataset.scene !== selected;
        scene.toggleAttribute("hidden", scene.dataset.scene !== selected);
      });
    });
    button.disabled = false;
  });
  function importExample(key) {
    wish.value = examples[key].wish;
    important.value = "";
    questions.value = examples[key].clarify + "\n" + examples[key].takeaway;
    people.value = summaries[key].people;
    carried = key;
    updatePreview();
    status.textContent = `${summaries[key].label} imported. All four fields are editable. Nothing has been sent.`;
  }
  $("#use-example").addEventListener("click", () => {
    if (inputs.some(input => input.value.trim())) {
      pending = selected;
      returnFocus = document.activeElement;
      $("#confirm-context").textContent = `${summaries[selected].label} — ${examples[selected].question}`;
      dialog.showModal();
    } else {
      importExample(selected);
      wish.focus();
    }
  });
  $("#cancel-example").addEventListener("click", () => dialog.close());
  $("#replace-example").addEventListener("click", () => {
    if (pending) importExample(pending);
    dialog.close();
  });
  dialog.addEventListener("close", () => {
    pending = null;
    returnFocus?.focus();
  });
  $("#use-example").disabled = false;
  inputs.forEach(input => input.addEventListener("input", updatePreview));
  function validate() {
    if (wish.value.trim()) return true;
    status.textContent =
      "Add a thought about what you would like to make easier first.";
    wish.setAttribute("aria-invalid", "true");
    wish.setAttribute("aria-describedby", "note-help note-status");
    wish.focus();
    return false;
  }
  function noteText() {
    return (
      "MY STARTING NOTE\nCustom Access Studios\n" +
      (carried ? `Started from ${summaries[carried].label}; editable example.\n` : "My own starting point.\n") +
      "\nI would like to make this easier:\n" +
      wish.value.trim() +
      "\n\nWhat matters most to me:\n" +
      (important.value.trim() || "Not added yet.") +
      "\n\nQuestions to ask:\n" + (questions.value.trim() || "Not added yet.") +
      "\n\nWho might help:\n" + (people.value.trim() || "Not added yet.") +
      "\n\nA starting point, not an assessment.\nThis note was created on my device. It has not been sent to Custom Access Studios.\n"
    );
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validate()) return;
    const url = URL.createObjectURL(
      new Blob([noteText()], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-starting-note.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent =
      "Your download has started. Nothing was sent to Emily. Keep the file somewhere private.";
  });
  // Enable only after interception is installed: without JS, this is never a sending form.
  $("#download-note").disabled = false;
  $("#print-note").addEventListener("click", () => {
    if (!validate()) return;
    $("#review-note").open = true;
    window.print();
  });
  $("#print-note").disabled = false;
  let reviewWasOpen;
  window.addEventListener("beforeprint", () => {
    reviewWasOpen = $("#review-note").open;
    $("#review-note").open = true;
  });
  window.addEventListener("afterprint", () => {
    $("#review-note").open = reviewWasOpen;
  });
  $("#copy-note").addEventListener("click", async () => {
    if (!validate()) return;
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(noteText());
      status.textContent =
        "Copied to your clipboard. Paste it into your own notes. Nothing was sent to Emily.";
    } catch {
      status.textContent =
        "Your browser couldn’t copy the note. Use Download note, or select and copy the visible preview instead.";
    }
  });
  $("#copy-note").disabled = false;
  updatePreview();
})();
