export const buttonProcessingState = (element) => {
    let submitBtn = document.querySelector(element);
    submitBtn.disabled = true;
    submitBtn.style.width = submitBtn.offsetWidth + "px";
    submitBtn.innerHTML = `
            <span class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </span>
        `;
}

export const buttonProcessingStateEnable = (element, text) => {
    let submitBtn = document.querySelector(element);
    submitBtn.disabled = false;
    submitBtn.style.width = "";
    submitBtn.textContent = text;
}