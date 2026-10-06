(function () {
  var form = document.getElementById("survey-form");
  var doneCard = document.getElementById("done-card");
  var requiredQuestions = ["q1", "q2", "q3", "q4", "q7", "q8", "q9", "q10"];

  function checkedCount(name) {
    return form.querySelectorAll('input[name="' + name + '"]:checked').length;
  }

  function hasChecked(name) {
    return checkedCount(name) > 0;
  }

  function setError(questionId, visible) {
    var card = form.querySelector('[data-question="' + questionId + '"]');
    var note = form.querySelector('[data-error="' + questionId + '"]');
    if (card) {
      card.classList.toggle("has-error", visible);
    }
    if (note) {
      note.classList.toggle("is-visible", visible);
    }
  }

  function isQuestionFilled(questionId) {
    if (questionId === "q10") {
      return hasChecked("q10a") && hasChecked("q10b") && hasChecked("q10c");
    }
    return hasChecked(questionId);
  }

  function clearErrorOnChange(questionId) {
    if (isQuestionFilled(questionId)) {
      setError(questionId, false);
    }
  }

  form.querySelectorAll("[data-other-toggle]").forEach(function (input) {
    var fieldId = input.getAttribute("data-other-toggle");
    var field = document.getElementById(fieldId);
    var textInput = field ? field.querySelector("input") : null;

    function sync() {
      if (!field) {
        return;
      }
      field.classList.toggle("is-open", input.checked);
      if (!input.checked && textInput) {
        textInput.value = "";
      }
    }

    input.addEventListener("change", sync);
    sync();
  });

  form.querySelectorAll(".options[data-max]").forEach(function (group) {
    var max = parseInt(group.getAttribute("data-max"), 10);
    var noteId = group.getAttribute("data-limit-note");
    var note = document.getElementById(noteId);
    var boxes = group.querySelectorAll('input[type="checkbox"]');

    boxes.forEach(function (box) {
      box.addEventListener("change", function () {
        var selected = group.querySelectorAll('input[type="checkbox"]:checked').length;
        if (box.checked && selected > max) {
          box.checked = false;
          var toggleId = box.getAttribute("data-other-toggle");
          if (toggleId) {
            var otherField = document.getElementById(toggleId);
            if (otherField) {
              otherField.classList.remove("is-open");
            }
          }
          if (note) {
            note.classList.add("is-visible");
          }
          return;
        }
        if (selected <= max && note) {
          note.classList.remove("is-visible");
        }
      });
    });
  });

  requiredQuestions.forEach(function (questionId) {
    var card = form.querySelector('[data-question="' + questionId + '"]');
    if (!card) {
      return;
    }
    card.querySelectorAll("input").forEach(function (input) {
      input.addEventListener("change", function () {
        clearErrorOnChange(questionId);
      });
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var firstInvalid = null;
    requiredQuestions.forEach(function (questionId) {
      var filled = isQuestionFilled(questionId);
      setError(questionId, !filled);
      if (!filled && !firstInvalid) {
        firstInvalid = form.querySelector('[data-question="' + questionId + '"]');
      }
    });

    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    form.classList.add("hidden");
    form.setAttribute("hidden", "");
    doneCard.removeAttribute("hidden");
    doneCard.classList.add("is-visible");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
