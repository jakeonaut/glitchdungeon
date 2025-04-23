// New Modal Body Scroll Lock behavior requires https://github.com/willmcpo/body-scroll-lock

class Modal {
  static wrapModals(printError = true) {
    try {
      Array.from(document.getElementsByClassName("modal-wrapper")).forEach((modalWrapper) => {
        // Close if you click outside the modal
        modalWrapper.addEventListener("click", (ev) => {
          if (modalWrapper.getElementsByClassName("modal")[0].style.display == "none") {
            modalWrapper.getElementsByClassName("modal")[0].style.display = "";
            return false;
          }
          
          ev.preventDefault();
          modalWrapper.style.display = "none";
          return false;
        });
        // Don't close if you click on the modal
        (modalWrapper.getElementsByClassName("modal")[0]).addEventListener("click", (ev) => {
          ev.stopPropagation();
          return false;
        });
        // But do close if you click the "X"!!!
        // (modalWrapper.getElementsByClassName("modal-close")[0]).addEventListener("click", (ev) => {
          // Modal.closeModal(modalWrapper);
          // ev.preventDefault();
          // return false;
        // });
        // Allow modal to be dragged around... TODO(jaketrower): YOu can't do this on pseudo-elements..
        // let isBeingDragged = false;
        // let modal = modalWrapper.getElementsByClassName("modal")[0];
        // (modalWrapper.querySelector(".modal::before")).addEventListener("pointerdown", (ev) => {
          // isBeingDragged = true;
          // ev.preventDefault();
          // return false;
        // });
        // (modalWrapper.querySelector(".modal::before")).addEventListener("pointerup", (ev) => {
          // isBeingDragged = false;
          // ev.preventDefault();
          // return false;
        // });
        // (modalWrapper.querySelector(".modal::before")).addEventListener("pointermove", (ev) => {
          // if (isBeingDragged) {
            // let newLeft = event.clientX - slider.getBoundingClientRect().left;
            // thumb.style.left = `calc(50% + newLeft + 'px')`;
          // }
          // ev.preventDefault();
          // return false;
        // });
      });
    } catch (err) {
      if (printError) {
        console.log(err);
      }
    }
  }
  
  static openModal(modalWrapper) {
    modalWrapper.style.display = "block";
  }
  
  static closeModal(modalWrapper) {
    modalWrapper.style.display = "none";
  }
  
  static async prompt(question) {
    // TODO(jaketrower): Not good but whatever
    const modalWrapper = document.getElementsByClassName("modal-wrapper")[0];
    return new Promise(function(resolve, reject) {
      modalWrapper.getElementsByClassName("modal-prompt-text")[0].textContent = question;
      modalWrapper.getElementsByClassName("modal-prompt-input")[0].value = "";
      modalWrapper.getElementsByClassName("modal-close")[0].onclick = (e) => {
        Modal.closeModal(modalWrapper);
        e.preventDefault();
        resolve('');
        return false;
      };
      modalWrapper.getElementsByClassName("modal-prompt-input")[0].onkeydown = (e) => {
        if (e.keyCode == 13) {
          resolve(modalWrapper.getElementsByClassName("modal-prompt-input")[0].value);
          Modal.closeModal(modalWrapper);
        }
      };
      modalWrapper.getElementsByClassName("modal-prompt-input-submit")[0].onclick = (e) => {
        e.preventDefault();
        resolve(modalWrapper.getElementsByClassName("modal-prompt-input")[0].value);
        Modal.closeModal(modalWrapper);
        return false;
      };
      Modal.openModal(modalWrapper);
      modalWrapper.getElementsByClassName("modal-prompt-input")[0].focus();
    });
  }
}
Modal.wrapModals(false);