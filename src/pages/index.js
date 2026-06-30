import "./index.css";
import { enableValidation, settings, resetValidation, disableButton } from "../scripts/validation.js";
import Api from "../utils/Api.js";


const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "a3d0cac4-3201-4d5d-992b-52cd8090bc11",
    "Content-Type": "application/json",
  },
});


function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) closeModal(openedModal);
  }
}

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === modal) closeModal(modal);
  });
  const closeBtn = modal.querySelector(".modal__close-btn");
  if (closeBtn) closeBtn.addEventListener("click", () => closeModal(modal));
});


const cardTemplate = document.querySelector("#card-template").content;
const cardsList = document.querySelector(".cards__list");


const previewModal = document.querySelector("#preview-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");


const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
let selectedCard;
let selectedCardId;

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = deleteForm.querySelector(".modal__button");
  submitBtn.textContent = "Deleting...";

  api.removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Yes, delete";
    });
}

deleteForm.addEventListener("submit", handleDeleteSubmit);


function getCardElement(data) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-btn");
  const deleteButton = cardElement.querySelector(".card__delete-btn");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  if (data.isLiked) likeButton.classList.add("card__like-btn_active");

  likeButton.addEventListener("click", () => {
    const isLiked = likeButton.classList.contains("card__like-btn_active");
    const request = isLiked ? api.dislikeCard(data._id) : api.likeCard(data._id);
    request
      .then(() => likeButton.classList.toggle("card__like-btn_active"))
      .catch(console.error);
  });

  deleteButton.addEventListener("click", () => handleDeleteCard(cardElement, data));

  cardImage.addEventListener("click", () => {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}


const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");


api.getAppInfo()
  .then(([userData, cards]) => {
    profileNameElement.textContent = userData.name;
    profileDescriptionElement.textContent = userData.about;
    profileAvatar.src = userData.avatar;
    cards.forEach((card) => cardsList.append(getCardElement(card)));
  })
  .catch(console.error);

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const profileFormElement = editProfileModal.querySelector(".modal__form");
const nameInput = profileFormElement.querySelector("#profile-name-input");
const descriptionInput = profileFormElement.querySelector("#profile-description-input");

editProfileBtn.addEventListener("click", () => {
  nameInput.value = profileNameElement.textContent;
  descriptionInput.value = profileDescriptionElement.textContent;
  resetValidation(profileFormElement, settings);
  openModal(editProfileModal);
});

profileFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = profileFormElement.querySelector(".modal__button");
  submitBtn.textContent = "Saving...";

  api.editUserInfo({ name: nameInput.value, about: descriptionInput.value })
    .then((userData) => {
      profileNameElement.textContent = userData.name;
      profileDescriptionElement.textContent = userData.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => { submitBtn.textContent = "Save"; });
});


const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const addCardFormElement = newPostModal.querySelector(".modal__form");
const cardNameInput = addCardFormElement.querySelector("#new-post-title-input");
const cardLinkInput = addCardFormElement.querySelector("#new-post-link-input");

newPostBtn.addEventListener("click", () => {
  addCardFormElement.reset();
  resetValidation(addCardFormElement, settings);
  openModal(newPostModal);
});

addCardFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = addCardFormElement.querySelector(".modal__button");
  submitBtn.textContent = "Saving...";

  api.addCard({ name: cardNameInput.value, link: cardLinkInput.value })
    .then((card) => {
      cardsList.prepend(getCardElement(card));
      addCardFormElement.reset();
      resetValidation(addCardFormElement, settings);
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => { submitBtn.textContent = "Save"; });
});

const editAvatarModal = document.querySelector("#edit-avatar-modal");
const avatarForm = editAvatarModal.querySelector(".modal__form");
const avatarInput = avatarForm.querySelector("#avatar-input");

document.querySelector(".profile__avatar-btn").addEventListener("click", () => {
  avatarForm.reset();
  resetValidation(avatarForm, settings);
  openModal(editAvatarModal);
});

avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = avatarForm.querySelector(".modal__button");
  submitBtn.textContent = "Saving...";

  api.editAvatar({ avatar: avatarInput.value })
    .then((userData) => {
  if (userData.avatar) {
    profileAvatar.src = userData.avatar;
  }
  avatarForm.reset();
  closeModal(editAvatarModal);
})
    .catch(console.error)
    .finally(() => { submitBtn.textContent = "Save"; });
});

const cancelDeleteBtn = deleteModal.querySelector(".modal__button_type_cancel");
cancelDeleteBtn.addEventListener("click", () => closeModal(deleteModal));

enableValidation(settings);