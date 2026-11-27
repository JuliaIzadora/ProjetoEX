const sidebar = document.getElementById("sidebar");
const openBtn = document.getElementById("open-btn");
const openBtnIcon = document.getElementById("open_btn_icon");

const campaignList = document.getElementById("campaign-list");
const modal = document.getElementById("campaign-modal");
const closeModalBtn = document.getElementById("close-modal");
const confirmModalBtn = document.getElementById("confirm-modal");

const filterHours = document.getElementById("filter-hours");
const filterCategory = document.getElementById("filter-category");
const clearFiltersBtn = document.getElementById("clear-filters");

const campaigns = [
    {
        title: "Campanha de arrecadação de brinquedos",
        category: "Solidariedade",
        image: "Campanha brinquedo.jpeg",
        description: "Arrecadação de alimentos não perecíveis para ajudar famílias em situação de vulnerabilidade.",
        deadline: "30/10/2026",
        hours: 15,
        maxItems: 3,
        location: "Sala de Matrículas da UNIPAR — confirme o ponto de entrega.",
        items: [
            "Somente brinquedos novos",
            "Não será aceito mini brinquedos como:",
            "ioiôs, carrinhos pequenos, varetas, brinquedos de celular, etc...",
        ],
        instructions: "Confirme com a organização quais produtos estão sendo recebidos e onde devem ser entregues."
    },
   
];

/* MENU LATERAL */
openBtn.addEventListener("click", function () {
    const isOpen = sidebar.classList.toggle("open-sidebar");

    openBtn.setAttribute("aria-expanded", String(isOpen));

    openBtnIcon.className = isOpen
        ? "fa-solid fa-xmark"
        : "fa-solid fa-bars";
});

/* PREENCHER AUTOMATICAMENTE AS OPÇÕES DOS FILTROS */
function createFilterOptions() {
    const availableHours = [...new Set(
        campaigns.map(campaign => campaign.hours)
    )].sort((a, b) => a - b);

    availableHours.forEach(function (hours) {
        const option = document.createElement("option");
        option.value = String(hours);
        option.textContent = hours + " horas";
        filterHours.appendChild(option);
    });

    const availableCategories = [...new Set(
        campaigns.map(campaign => campaign.category)
    )].sort((a, b) => a.localeCompare(b, "pt-BR"));

    availableCategories.forEach(function (category) {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        filterCategory.appendChild(option);
    });
}

/* CRIAR INFORMAÇÕES RESUMIDAS DOS CARDS */
function createSummaryItem(iconClass, text) {
    const item = document.createElement("p");
    const icon = document.createElement("i");
    const span = document.createElement("span");

    icon.className = iconClass;
    icon.setAttribute("aria-hidden", "true");
    span.textContent = text;

    item.append(icon, span);
    return item;
}

/* CRIAR OS CARDS DAS CAMPANHAS E APLICAR OS FILTROS */
function renderCampaigns() {
    campaignList.innerHTML = "";

    const selectedHours = filterHours.value;
    const selectedCategory = filterCategory.value;

    const filteredCampaigns = campaigns.filter(function (campaign) {
        const matchesHours =
            selectedHours === "all" ||
            String(campaign.hours) === selectedHours;

        const matchesCategory =
            selectedCategory === "all" ||
            campaign.category === selectedCategory;

        return matchesHours && matchesCategory;
    });

    if (filteredCampaigns.length === 0) {
        const message = document.createElement("p");
        message.className = "no-campaigns";
        message.textContent =
            "Nenhuma campanha encontrada com esses filtros. Tente outras opções.";

        campaignList.appendChild(message);
        return;
    }

    filteredCampaigns.forEach(function (campaign) {
        const card = document.createElement("article");
        card.className = "campaign-card";

        const image = document.createElement("img");
        image.className = "campaign-image";
        image.src = campaign.image;
        image.alt = campaign.title;
        image.loading = "lazy";

        const body = document.createElement("div");
        body.className = "campaign-card-body";

        const category = document.createElement("span");
        category.className = "campaign-category";
        category.textContent = campaign.category;

        const title = document.createElement("h2");
        title.textContent = campaign.title;

        const description = document.createElement("p");
        description.className = "campaign-short-description";
        description.textContent = campaign.description;

        const summary = document.createElement("div");
        summary.className = "campaign-summary";

        summary.append(
            createSummaryItem(
                "fa-regular fa-calendar",
                "Prazo final: " + campaign.deadline
            ),
            createSummaryItem(
                "fa-regular fa-clock",
                campaign.hours + " horas complementares"
            ),
            createSummaryItem(
                "fa-solid fa-box",
                "Máximo: " + campaign.maxItems + " itens por aluno"
            )
        );

        const button = document.createElement("button");
        button.className = "learn-more";
        button.type = "button";
        button.textContent = "Saiba mais";

        button.addEventListener("click", function () {
            openCampaignModal(campaign, button);
        });

        body.append(category, title, description, summary, button);
        card.append(image, body);
        campaignList.appendChild(card);
    });
}

/* EVENTOS DOS FILTROS */
filterHours.addEventListener("change", renderCampaigns);
filterCategory.addEventListener("change", renderCampaigns);

clearFiltersBtn.addEventListener("click", function () {
    filterHours.value = "all";
    filterCategory.value = "all";
    renderCampaigns();
});

/* ABRIR DETALHES DA CAMPANHA */
let previousButton = null;

function openCampaignModal(campaign, button) {
    previousButton = button;

    document.getElementById("modal-image").src = campaign.image;
    document.getElementById("modal-image").alt = campaign.title;
    document.getElementById("modal-category").textContent = campaign.category;
    document.getElementById("modal-title").textContent = campaign.title;
    document.getElementById("modal-description").textContent = campaign.description;
    document.getElementById("modal-deadline").textContent = campaign.deadline;
    document.getElementById("modal-hours").textContent = campaign.hours + " horas";
    document.getElementById("modal-limit").textContent =
        campaign.maxItems + " itens por aluno";
    document.getElementById("modal-location").textContent = campaign.location;
    document.getElementById("modal-instructions").textContent = campaign.instructions;

    const itemsList = document.getElementById("modal-items");
    itemsList.innerHTML = "";

    campaign.items.forEach(function (itemText) {
        const li = document.createElement("li");
        const icon = document.createElement("i");
        const span = document.createElement("span");

        icon.className = "fa-solid fa-circle-check";
        icon.setAttribute("aria-hidden", "true");
        span.textContent = itemText;

        li.append(icon, span);
        itemsList.appendChild(li);
    });

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeModalBtn.focus();
}

/* FECHAR MODAL DAS CAMPANHAS */
function closeCampaignModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (previousButton && previousButton.isConnected) {
        previousButton.focus();
    }
}

closeModalBtn.addEventListener("click", closeCampaignModal);
confirmModalBtn.addEventListener("click", closeCampaignModal);

modal.addEventListener("click", function (event) {
    if (event.target === modal) {
        closeCampaignModal();
    }
});

/* MODAL SUA PROPOSTA */
const proposalModal = document.getElementById("proposal-modal");
const openProposalBtn = document.getElementById("open-proposal");
const closeProposalBtn = document.getElementById("close-proposal");
const proposalForm = document.getElementById("proposal-form");
const proposalStatus = document.getElementById("proposal-status");
const sendProposalBtn = document.getElementById("send-proposal");

/* ABRIR FORMULÁRIO */
openProposalBtn.addEventListener("click", function (event) {
    event.preventDefault();

    proposalModal.classList.add("active");
    proposalModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    document.getElementById("proposal-name").focus();
});

/* FECHAR FORMULÁRIO */
function closeProposalModal() {
    if (sendProposalBtn.disabled) return;

    proposalModal.classList.remove("active");
    proposalModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    openProposalBtn.focus();
}

closeProposalBtn.addEventListener("click", closeProposalModal);

proposalModal.addEventListener("click", function (event) {
    if (event.target === proposalModal) {
        closeProposalModal();
    }
});

/* FECHAR COM ESCAPE */
document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;

    if (proposalModal.classList.contains("active")) {
        closeProposalModal();
    } else if (modal.classList.contains("active")) {
        closeCampaignModal();
    } else if (teamModal.classList.contains("active")) {
        closeTeamModal();
    }
});

/* ENVIO DA PROPOSTA POR E-MAIL */
proposalForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (proposalForm.elements["_honey"].value) {
        return;
    }

    proposalStatus.textContent = "";
    proposalStatus.className = "proposal-status";

    sendProposalBtn.disabled = true;
    sendProposalBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

    try {
        const formData = new FormData(proposalForm);

        /*
          IMPORTANTE:
          Emial onde irá as as propostas
        */
        const response = await fetch(
            "https://formsubmit.co/ajax/campanhaunipar@gmail.com",
            {
                method: "POST",
                headers: {
                    "Accept": "application/json"
                },
                body: formData
            }
        );

        const result = await response.json();

        if (!response.ok ||
            !(result.success === true || result.success === "true")) {
            throw new Error("Não foi possível confirmar o envio.");
        }

        proposalStatus.textContent =
            "Proposta enviada com sucesso! Obrigado por contribuir com o Hora Amiga.";

        proposalStatus.classList.add("success");
        proposalForm.reset();

    } catch (error) {
        proposalStatus.textContent =
            "Não foi possível confirmar o envio. Verifique a configuração do e-mail e tente novamente.";

        proposalStatus.classList.add("error");

    } finally {
        sendProposalBtn.disabled = false;
        sendProposalBtn.innerHTML =
            '<i class="fa-solid fa-paper-plane"></i> Enviar proposta';
    }
});


/* MODAL NOSSA EQUIPE */
const teamModal = document.getElementById("team-modal");
const openTeamBtn = document.getElementById("open-team");
const closeTeamBtn = document.getElementById("close-team");

/* ABRIR MODAL DA EQUIPE */
openTeamBtn.addEventListener("click", function (event) {
    event.preventDefault();
    teamModal.classList.add("active");
    teamModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
});

/* FECHAR MODAL DA EQUIPE */
function closeTeamModal() {
    teamModal.classList.remove("active");
    teamModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    openTeamBtn.focus();
}

closeTeamBtn.addEventListener("click", closeTeamModal);

teamModal.addEventListener("click", function (event) {
    if (event.target === teamModal) {
        closeTeamModal();
    }
});


/* INICIALIZAR A PÁGINA */
createFilterOptions();
renderCampaigns();