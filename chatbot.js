/**
 * CHATBOT NANNAN COM
 * Scénarios : Vente / Support / Prise de rendez-vous
 */

document.addEventListener('DOMContentLoaded', () => {
    initChatbot();
});

let chatbotState = {
    currentScenario: null,
    currentStep: 0,
    userData: {}
};

function initChatbot() {
    const toggle = document.getElementById('chatbot-toggle');
    const window = document.getElementById('chatbot-window');
    const close = document.getElementById('chatbot-close');
    const messagesContainer = document.getElementById('chatbot-messages');
    
    if (!toggle || !window || !close || !messagesContainer) return;
    
    // Toggle chatbot
    toggle.addEventListener('click', () => {
        window.classList.toggle('active');
        if (window.classList.contains('active') && messagesContainer.children.length === 0) {
            showWelcomeMessage();
        }
    });
    
    // Close chatbot
    close.addEventListener('click', () => {
        window.classList.remove('active');
    });
    
    // Initial welcome message
    setTimeout(() => {
        if (!window.classList.contains('active')) {
            toggle.classList.add('pulse');
        }
    }, 3000);
}

function showWelcomeMessage() {
    addBotMessage('👋 Bonjour et bienvenue chez NanNan Com – Innovation digitale 360°\nJe suis votre assistant digital. Comment puis-je vous aider aujourd\'hui ?');
    
    addButtons([
        { text: '1️⃣ Découvrir vos services', action: 'scenario-vente' },
        { text: '2️⃣ Parler à un conseiller', action: 'scenario-support' },
        { text: '3️⃣ Prendre un rendez-vous', action: 'scenario-rdv' },
        { text: '4️⃣ Support / Question rapide', action: 'scenario-support' }
    ]);
}

function addBotMessage(text) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message bot-message';
    messageDiv.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
    messagesContainer.appendChild(messageDiv);
    scrollChatbot();
}

function addUserMessage(text) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message user-message';
    messageDiv.innerHTML = `<p>${text}</p>`;
    messagesContainer.appendChild(messageDiv);
    scrollChatbot();
}

function addButtons(buttons) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'chatbot-buttons';
    
    buttons.forEach(button => {
        const btn = document.createElement('button');
        btn.className = 'chatbot-btn';
        btn.textContent = button.text;
        btn.setAttribute('data-action', button.action);
        btn.addEventListener('click', () => {
            buttonsDiv.remove();
            handleButtonClick(button.action, button.text);
        });
        buttonsDiv.appendChild(btn);
    });
    
    messagesContainer.appendChild(buttonsDiv);
    scrollChatbot();
}

function addInputField(placeholder, type = 'text', callback) {
    const inputContainer = document.getElementById('chatbot-input-container');
    inputContainer.innerHTML = '';
    
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;
    input.className = 'chatbot-input';
    
    const sendBtn = document.createElement('button');
    sendBtn.className = 'chatbot-send';
    sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
    
    const form = document.createElement('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = input.value.trim();
        if (value) {
            addUserMessage(value);
            inputContainer.innerHTML = '';
            callback(value);
        }
    });
    
    sendBtn.addEventListener('click', () => {
        const value = input.value.trim();
        if (value) {
            addUserMessage(value);
            inputContainer.innerHTML = '';
            callback(value);
        }
    });
    
    form.appendChild(input);
    form.appendChild(sendBtn);
    inputContainer.appendChild(form);
    input.focus();
}

function handleButtonClick(action, buttonText) {
    addUserMessage(buttonText);
    
    if (action === 'scenario-vente') {
        startVenteScenario();
    } else if (action === 'scenario-support') {
        startSupportScenario();
    } else if (action === 'scenario-rdv') {
        startRendezVousScenario();
    } else {
        handleChatbotAction(action);
    }
}

// SCÉNARIO 1 - VENTE
function startVenteScenario() {
    chatbotState.currentScenario = 'vente';
    chatbotState.currentStep = 1;
    
    setTimeout(() => {
        addBotMessage('Parfait 👍\nQuel type de service vous intéresse ?');
        addButtons([
            { text: 'Branding & identité visuelle', action: 'service-branding' },
            { text: 'Communication digitale', action: 'service-communication' },
            { text: 'Création de site web / application', action: 'service-web' },
            { text: 'Production de contenu & média', action: 'service-media' },
            { text: 'Chatbot / automatisation', action: 'service-chatbot' },
            { text: 'Autre besoin', action: 'service-autre' }
        ]);
    }, 500);
}

function handleServiceSelection(service) {
    chatbotState.userData.service = service;
    chatbotState.currentStep = 2;
    
    setTimeout(() => {
        addBotMessage('Pouvez-vous me dire brièvement votre besoin ou objectif ?');
        addInputField('Décrivez votre projet...', 'text', (text) => {
            chatbotState.userData.besoin = text;
            askProfil();
        });
    }, 500);
}

function askProfil() {
    chatbotState.currentStep = 3;
    
    setTimeout(() => {
        addBotMessage('Vous êtes plutôt :');
        addButtons([
            { text: 'Entrepreneur / Startup', action: 'profil-startup' },
            { text: 'PME / Entreprise', action: 'profil-pme' },
            { text: 'Institution / ONG', action: 'profil-institution' },
            { text: 'Média / Créateur de contenu', action: 'profil-media' }
        ]);
    }, 500);
}

function handleProfilSelection(profil) {
    chatbotState.userData.profil = profil;
    chatbotState.currentStep = 4;
    
    setTimeout(() => {
        addBotMessage('Merci 🙏\nPour qu\'un expert NanNan Com vous recontacte, pouvez-vous nous laisser vos coordonnées ?');
        askContactInfo();
    }, 500);
}

function askContactInfo() {
    let step = 0;
    const fields = [
        { name: 'nom', label: 'Nom complet', placeholder: 'Votre nom' },
        { name: 'email', label: 'Email', placeholder: 'votre@email.com', type: 'email' },
        { name: 'telephone', label: 'Téléphone', placeholder: '+229 XX XX XX XX', type: 'tel' }
    ];
    
    function askNextField() {
        if (step < fields.length) {
            const field = fields[step];
            addBotMessage(`${field.label} :`);
            addInputField(field.placeholder, field.type || 'text', (value) => {
                chatbotState.userData[field.name] = value;
                step++;
                if (step < fields.length) {
                    askNextField();
                } else {
                    confirmLead();
                }
            });
        }
    }
    
    askNextField();
}

function confirmLead() {
    chatbotState.currentStep = 5;
    
    setTimeout(() => {
        addBotMessage('✅ Merci !\nUn membre de notre équipe vous contactera très rapidement.\nSouhaitez-vous aussi prendre un rendez-vous maintenant ?');
        addButtons([
            { text: 'Oui, prendre RDV', action: 'rdv-now' },
            { text: 'Non, plus tard', action: 'finish' }
        ]);
    }, 500);
}

// SCÉNARIO 2 - SUPPORT
function startSupportScenario() {
    chatbotState.currentScenario = 'support';
    chatbotState.currentStep = 1;
    
    setTimeout(() => {
        addBotMessage('D\'accord 😊\nQuelle est votre question ?');
        addButtons([
            { text: 'Informations sur les services', action: 'info-services' },
            { text: 'Délais de réalisation', action: 'delais' },
            { text: 'Tarifs / devis', action: 'tarifs' },
            { text: 'Partenariats', action: 'partenariats' },
            { text: 'Autre question', action: 'autre-question' }
        ]);
    }, 500);
}

function handleSupportQuestion(type) {
    let response = '';
    
    switch(type) {
        case 'tarifs':
            response = '💡 Nos tarifs dépendent de votre projet et de vos objectifs.\nNous proposons des solutions adaptées à chaque budget.\n👉 Souhaitez-vous un devis personnalisé ?';
            break;
        case 'delais':
            response = '⏱️ Les délais varient selon la complexité du projet.\nEn moyenne :\n• Branding : 2-4 semaines\n• Site web : 4-8 semaines\n• Application : 8-12 semaines\n👉 Souhaitez-vous un devis avec planning détaillé ?';
            break;
        case 'info-services':
            response = '📋 Nous proposons :\n• Branding & identité visuelle\n• Communication digitale\n• Sites web & applications\n• Production média\n• Chatbot & automatisation\n👉 Quelle service vous intéresse ?';
            break;
        default:
            response = 'Merci pour votre question. Un conseiller va vous répondre rapidement.';
    }
    
    setTimeout(() => {
        addBotMessage(response);
        
        if (type === 'tarifs' || type === 'delais') {
            addButtons([
                { text: 'Oui', action: 'devis-request' },
                { text: 'Non', action: 'escalade' }
            ]);
        } else {
            setTimeout(() => {
                askEscalade();
            }, 1000);
        }
    }, 500);
}

function askEscalade() {
    setTimeout(() => {
        addBotMessage('Souhaitez-vous échanger avec un conseiller humain ?');
        addButtons([
            { text: 'Oui', action: 'escalade-yes' },
            { text: 'Non', action: 'finish' }
        ]);
    }, 500);
}

// SCÉNARIO 3 - RENDEZ-VOUS
function startRendezVousScenario() {
    chatbotState.currentScenario = 'rdv';
    chatbotState.currentStep = 1;
    
    setTimeout(() => {
        addBotMessage('Très bien 📅\nQuel type de rendez-vous souhaitez-vous ?');
        addButtons([
            { text: 'Appel téléphonique', action: 'rdv-phone' },
            { text: 'Réunion en ligne', action: 'rdv-online' },
            { text: 'Rencontre physique', action: 'rdv-physical' }
        ]);
    }, 500);
}

function handleRendezVousType(type) {
    chatbotState.userData.rdvType = type;
    chatbotState.currentStep = 2;
    
    setTimeout(() => {
        addBotMessage('Choisissez votre créneau disponible :\n📆 (Vous pouvez aussi nous contacter directement pour planifier)');
        addButtons([
            { text: 'Lundi - Mercredi', action: 'rdv-lundi' },
            { text: 'Jeudi - Vendredi', action: 'rdv-jeudi' },
            { text: 'Contacter directement', action: 'rdv-contact' }
        ]);
    }, 500);
}

function askRendezVousInfo() {
    chatbotState.currentStep = 3;
    
    setTimeout(() => {
        addBotMessage('Parfait 👍\nMerci de confirmer vos informations :');
        askContactInfoForRdv();
    }, 500);
}

function askContactInfoForRdv() {
    let step = 0;
    const fields = [
        { name: 'nom', label: 'Nom', placeholder: 'Votre nom' },
        { name: 'email', label: 'Email', placeholder: 'votre@email.com', type: 'email' },
        { name: 'telephone', label: 'Téléphone', placeholder: '+229 XX XX XX XX', type: 'tel' }
    ];
    
    function askNextField() {
        if (step < fields.length) {
            const field = fields[step];
            addBotMessage(`${field.label} :`);
            addInputField(field.placeholder, field.type || 'text', (value) => {
                chatbotState.userData[field.name] = value;
                step++;
                if (step < fields.length) {
                    askNextField();
                } else {
                    confirmRendezVous();
                }
            });
        }
    }
    
    askNextField();
}

function confirmRendezVous() {
    setTimeout(() => {
        addBotMessage('✅ Votre rendez-vous est confirmé !\nVous recevrez un rappel automatique avant l\'échange.\nÀ très bientôt avec NanNan Com 🚀');
        setTimeout(() => {
            showEndMessage();
        }, 2000);
    }, 500);
}

function showEndMessage() {
    setTimeout(() => {
        addBotMessage('Merci de votre visite 👋\nN\'hésitez pas à revenir si vous avez besoin d\'aide.\n👉 NanNan Com – Innovation numérique 360°');
    }, 1000);
}

function scrollChatbot() {
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Helper function to handle button actions
function handleChatbotAction(action) {
    // Handle service selection
    if (action.includes('service-')) {
        const service = action.replace('service-', '');
        handleServiceSelection(service);
    }
    // Handle profil selection
    else if (action.includes('profil-')) {
        const profil = action.replace('profil-', '');
        handleProfilSelection(profil);
    }
    // Handle support questions
    else if (['info-services', 'delais', 'tarifs', 'partenariats', 'autre-question'].includes(action)) {
        handleSupportQuestion(action);
    }
    // Handle RDV type
    else if (action.includes('rdv-') && action !== 'rdv-now' && action !== 'rdv-contact') {
        if (action === 'rdv-phone' || action === 'rdv-online' || action === 'rdv-physical') {
            handleRendezVousType(action);
        } else if (action.includes('rdv-lundi') || action.includes('rdv-jeudi')) {
            askRendezVousInfo();
        }
    }
    // Handle RDV contact
    else if (action === 'rdv-contact') {
        askRendezVousInfo();
    }
    // Handle escalade
    else if (action === 'escalade-yes') {
        addBotMessage('Un conseiller va vous contacter très prochainement. Merci !');
        setTimeout(() => showEndMessage(), 2000);
    }
    // Handle finish
    else if (action === 'finish') {
        showEndMessage();
    }
    // Handle devis request
    else if (action === 'devis-request') {
        askContactInfo();
    }
    // Handle RDV now from vente scenario
    else if (action === 'rdv-now') {
        startRendezVousScenario();
    }
}
