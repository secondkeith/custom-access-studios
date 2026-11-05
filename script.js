"use strict";
(() => {
  const $ = (selector) => document.querySelector(selector);
  const form = $("#starting-note");
  if (!form) return;
  const wish = $("#wish"),
    important = $("#important"),
    questions = $("#questions"),
    people = $("#people");
  const inputs = [wish, important, questions, people];
  const status = $("#note-status"),
    dialog = $("#example-confirm");
  const examples = {
    reach: {
      label: "01 / A mug",
      routine: "Making tea. From the cupboard to your favourite chair.",
      question: "“I just want to reach my favourite mug.”",
      caption:
        "The tea, the mug, the familiar ritual. What would you like to keep?",
      clarify:
        "Is the shelf too high, the handle hard to grip, or the mug heavy when full? Which part of making tea takes the most effort?",
      productTitle: "Look beyond the mug",
      productCopy:
        "What about lifting the kettle, carrying the drink, or reaching other everyday things? We would ask what else feels awkward—not assume it does.",
      specialistTitle: "Consider what fits your life",
      specialistCopy:
        "A lower shelf, a different cup, or an off-the-shelf fitting may be enough. If not, a custom storage design could be explored with a suitable specialist. Keep the favourite mug in the conversation.",
      revisit:
        "Does it still feel comfortable when you’re tired, or if you use the kitchen differently? A useful change today can be reconsidered later, with you.",
      caution:
        "These are prompts, not recommendations. Fit, load limits, comfortable operation and safe installation would need checking.",
      need: "Reaching is only one part of making tea.",
      summary: "Is it the height, the grip, or the weight?",
      related: "Lifting the kettle, carrying tea, reaching storage.",
      routes: "Move the mug, try an existing fitting, or explore custom storage.",
      later: "Still comfortable on a tired day or with a different kitchen routine?",
      wish: "I’d like to use my everyday mugs without struggling to reach, lift or carry them.",
      takeaway:
        "What else in making tea feels difficult? Could a simple change help, and what would need checking before choosing a product or custom design?",
      people:
        "CAS, to think through the routine with me; a storage supplier or suitably qualified specialist if a fitting or alteration needs exploring.",
    },
    lighting: {
      label: "02 / A light",
      routine: "An evening read. From your chair to the next room.",
      question: "“I’d like to turn the light on from here.”",
      caption:
        "Being comfortable in your chair should not mean being stuck in the dark.",
      clarify:
        "Is the difficulty reaching the switch, pressing it, or seeing it? Is the light itself comfortable to read by? Would you rather avoid an app?",
      productTitle: "Look beyond the switch",
      productCopy:
        "What happens when you get up at night, move between rooms, or need the curtains closed? We would explore glare, other controls and the route you use—only where they matter to you.",
      specialistTitle: "Consider simplicity as well as features",
      specialistCopy:
        "Moving a lamp or choosing an off-the-shelf control might help. A tailored lighting or control design is another possibility. Compare compatibility, usable buttons, reliability and a backup—not just a “smart” label.",
      revisit:
        "If your seating, vision or preferences change, does the light still work for you? Revisit placement and controls rather than expect you to adapt to them.",
      caution:
        "These are prompts, not electrical instructions. Compatibility and electrical safety need checking; fixed wiring or switch alterations require a qualified electrician.",
      need: "A better switch is not always the whole answer.",
      summary: "Is it reach, operation, visibility—or the light itself?",
      related: "Other controls, the night-time route, and glare.",
      routes: "Move a lamp, try an existing control, or explore a tailored lighting design.",
      later: "Recheck placement and controls if seating, vision or preferences change.",
      wish: "I’d like to control the light comfortably from where I sit, with light that suits what I’m doing.",
      takeaway:
        "Would a simple control suit me? What happens without Wi-Fi? Would a qualified electrician need to assess any changes?",
      people:
        "CAS, to explore what feels comfortable; a lighting supplier or designer; a qualified electrician for fixed wiring or switch changes.",
    },
    doorway: {
      label: "03 / A door",
      routine: "Moving freely. Through the doorway and into the day.",
      question: "“This doorway makes me think twice.”",
      caption: "The handle is a starting point. Your whole journey matters.",
      clarify:
        "Is gripping or turning the handle difficult? Does pushing the door take too much force? Is there enough clearance for your walker, including room to turn?",
      productTitle: "Look beyond this door",
      productCopy:
        "Do windows, the fridge or cabinet doors ask for the same awkward grip or effort? What about the threshold and the space beyond? We would ask, not assume—and follow what you notice.",
      specialistTitle: "Consider the cause, not just the handle",
      specialistCopy:
        "Different off-the-shelf hardware could suit one difficulty but leave another untouched. A custom alteration may be worth exploring with a qualified access or building professional. Check operating force, clearance and the whole route.",
      revisit:
        "If you use a different mobility aid or your strength varies, would the route still work? We can consider room for change without assuming what your future will be.",
      caution:
        "These are prompts, not a diagnosis or alteration plan. Safe access, fire safety, building requirements and structural changes need appropriate professional assessment.",
      need: "The same doorway can be difficult for different reasons.",
      summary: "Grip and turning, pushing force, or clearance for a walker?",
      related: "Do windows, the fridge or cabinets ask for the same grip or effort?",
      routes: "Compare existing hardware with a custom alteration, with qualified advice.",
      later: "Would this route still suit a different mobility aid or varying strength?",
      wish: "I’d like to move through a familiar doorway more comfortably, without struggling with the handle, force or space.",
      takeaway:
        "Do my windows, fridge or cabinets pose similar difficulties? What needs professional assessment, and would an option still suit me if my needs change?",
      people:
        "CAS, to explore the wider picture with me; a qualified access or building professional for assessment; a hardware supplier where relevant.",
    },
  };
  let selected = "reach",
    carried = null,
    pending = null,
    returnFocus = null;
  if (matchMedia("(min-width: 721px)").matches) {

    $("#review-note").open = true;
  }
  function updatePreview() {
    const targets = [
      "#preview-wish",
      "#preview-important",
      "#preview-question",
      "#preview-people",
    ];
    const placeholders = [
      "Your everyday moment will appear here.",
      "The things you want to keep in mind.",
      "Your questions will appear here.",
      "People or roles to ask about.",
    ];
    inputs.forEach((input, i) => {
      $(targets[i]).textContent = input.value.trim() || placeholders[i];
      $(targets[i]).classList.toggle("empty", !input.value.trim());
    });
    if (!inputs.some((input) => input.value.trim())) carried = null;
    $("#note-scenario").textContent = carried
      ? `Started from ${examples[carried].label} · Edited by you`
      : "Your own starting point";
    if (wish.value.trim()) wish.removeAttribute("aria-invalid");
  }
  const fields = {
    "#example-question": "question",
    "#home-routine": "routine",
    "#scene-caption": "caption",
    "#clarify": "clarify",
    "#product-title": "productTitle",
    "#product-copy": "productCopy",
    "#specialist-title": "specialistTitle",
    "#specialist-copy": "specialistCopy",
    "#revisit": "revisit",
    "#example-caution": "caution",
    "#overview-scenario": "label",
    "#overview-need": "need",
    "#overview-clarify": "summary",
    "#overview-routes": "routes",
    "#overview-related": "related",
    "#overview-revisit": "later",
  };
  document.querySelectorAll("[data-example]").forEach((button) => {
    button.addEventListener("click", () => {
      selected = button.dataset.example;
      document
        .querySelectorAll("[data-example]")
        .forEach((item) =>
          item.setAttribute(
            "aria-pressed",
            String(item.dataset.example === selected),
          ),
        );
      Object.entries(fields).forEach(([selector, key]) => {
        $(selector).textContent = examples[selected][key];
      });
      // Changing the illustrative scene never changes the visitor’s writing.
      document.querySelectorAll('[data-room-scene]').forEach((scene) =>
        scene.toggleAttribute('hidden', scene.dataset.roomScene !== selected));
      if (button.closest(".example-repeat")) {
        $("#example-details").open = false;
        $(`.example-controls [data-example="${selected}"]`).focus();
      }
      document
        .querySelectorAll("[data-scene]")
        .forEach((scene) =>
          scene.toggleAttribute("hidden", scene.dataset.scene !== selected),
        );
    });
    button.disabled = false;
  });
  function importExample(key) {
    wish.value = examples[key].wish;
    important.value = "";
    questions.value = examples[key].clarify + "\n" + examples[key].takeaway;
    people.value = examples[key].people;
    carried = key;
    $("#notepad-tools").open = true;
    updatePreview();
    status.textContent = `${examples[key].label} imported. All four fields are editable. Nothing has been sent.`;
  }
  $("#use-example").addEventListener("click", () => {
    if (inputs.some((input) => input.value.trim())) {
      pending = selected;
      returnFocus = document.activeElement;
      $("#confirm-context").textContent =
        `${examples[selected].label} — ${examples[selected].question}`;
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
  inputs.forEach((input) => input.addEventListener("input", updatePreview));
  function validate() {
    if (wish.value.trim()) return true;
    $("#notepad-tools").open = true;
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
      (carried
        ? `Started from ${examples[carried].label}; editable example.\n`
        : "My own starting point.\n") +
      "\nI would like to make this easier:\n" +
      wish.value.trim() +
      "\n\nWhat matters most to me:\n" +
      (important.value.trim() || "Not added yet.") +
      "\n\nQuestions to ask:\n" +
      (questions.value.trim() || "Not added yet.") +
      "\n\nWho might help:\n" +
      (people.value.trim() || "Not added yet.") +
      "\n\nA starting point, not an assessment.\nThis note was created on my device. It has not been sent to Custom Access Studios.\n"
    );
  }
  // Install interception before enabling export; without JS no submit is possible.
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
      "Your download has started. Nothing was sent to CAS. Keep the file somewhere private.";
  });
  $("#download-note").disabled = false;
  $("#print-note").addEventListener("click", () => {
    if (!validate()) return;
    $("#review-note").open = true;
    window.print();
  });
  $("#print-note").disabled = false;
  let reviewWasOpen, notepadWasOpen;
  window.addEventListener("beforeprint", () => {
    reviewWasOpen = $("#review-note").open;
    notepadWasOpen = $("#notepad-tools").open;
    $("#notepad-tools").open = true;
    $("#review-note").open = true;
  });
  window.addEventListener("afterprint", () => {
    $("#review-note").open = reviewWasOpen;
    $("#notepad-tools").open = notepadWasOpen;
  });
  $("#copy-note").addEventListener("click", async () => {
    if (!validate()) return;
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(noteText());
      status.textContent =
        "Copied to your clipboard. Paste it into your own notes. Nothing was sent to CAS.";
    } catch {
      status.textContent =
        "Your browser couldn’t copy the note. Use Download text, or select and copy the visible preview instead.";
    }
  });
  $("#copy-note").disabled = false;
  updatePreview();
})();
