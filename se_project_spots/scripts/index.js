// =========================
// Modal Open / Close
// =========================
function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

// Close modal on Escape key press
function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

// Close modal when clicking on the overlay (outside modal container)
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});

// =========================
// Initial Cards Data
// =========================
const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

// =========================
// Card Template & List
// =========================
const cardTemplate = document.querySelector("#card-template").content;
const cardsList = document.querySelector(".cards__list");

// =========================
// Preview Modal
// =========================
const previewModal = document.querySelector("#preview-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn");

previewCloseBtn.addEventListener("click", () => closeModal(previewModal));

// =========================
// Card Factory
// =========================
function getCardElement(data) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-btn");
  const deleteButton = cardElement.querySelector(".card__delete-btn");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("card__like-btn_active");
  });

  deleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImage.addEventListener("click", () => {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

// Render initial cards
initialCards.forEach((item) => {
  const card = getCardElement(item);
  cardsList.prepend(card);
});

// =========================
// Edit Profile Modal
// =========================
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");

const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description",
);

const profileFormElement = editProfileModal.querySelector(".modal__form");
const nameInput = profileFormElement.querySelector("#profile-name-input");
const descriptionInput = profileFormElement.querySelector(
  "#profile-description-input",
);

function openProfileModal() {
  // Pre-fill inputs with current profile values
  nameInput.value = profileNameElement.textContent;
  descriptionInput.value = profileDescriptionElement.textContent;

  // Reset validation errors, then re-enable button since data is pre-filled and valid
  resetValidation(profileFormElement, settings);
  const submitBtn = profileFormElement.querySelector(
    settings.submitButtonSelector,
  );
  submitBtn.classList.remove(settings.inactiveButtonClass);
  submitBtn.disabled = false;

  openModal(editProfileModal);
}

editProfileBtn.addEventListener("click", openProfileModal);
editProfileCloseBtn.addEventListener("click", () =>
  closeModal(editProfileModal),
);

profileFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  profileNameElement.textContent = nameInput.value;
  profileDescriptionElement.textContent = descriptionInput.value;
  closeModal(editProfileModal);
});

// =========================
// New Post Modal
// =========================
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");

const addCardFormElement = newPostModal.querySelector(".modal__form");
const cardNameInput = addCardFormElement.querySelector("#new-post-title-input");
const cardLinkInput = addCardFormElement.querySelector("#new-post-link-input");

newPostBtn.addEventListener("click", () => openModal(newPostModal));
newPostCloseBtn.addEventListener("click", () => closeModal(newPostModal));

addCardFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const newCardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  const newCard = getCardElement(newCardData);
  cardsList.prepend(newCard);

  // Reset form and validation after successful submission
  addCardFormElement.reset();
  resetValidation(addCardFormElement, settings);

  closeModal(newPostModal);
});
