console.log('all_testimonials.js loaded');
console.log('testimonialsData on load:', typeof testimonialsData);

const testimonialsGrid = document.getElementById('testimonials-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

// Video Modal
const videoModal = document.getElementById('video-modal');
const testimonialVideo = document.getElementById('testimonial-video');
const closeModalBtn = videoModal.querySelector('.close-modal');

// Image Modal
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const closeImageModalBtn = imageModal.querySelector('.close-modal');

const floatingSubmitBtn = document.getElementById('floating-submit-btn');
const submissionFormOverlay = document.getElementById('submission-form-overlay');
const closeFormBtn = submissionFormOverlay.querySelector('.close-form');
const testimonialForm = document.getElementById('testimonial-form');
const formTypeRadios = testimonialForm.querySelectorAll('input[name="type"]');
const contentGroup = document.getElementById('content-group');
const fileUploadGroup = submissionFormOverlay.querySelector('.file-upload-group');
const fileMessageGroup = document.getElementById('file-message-group');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('form-file');
const fileNameDisplay = submissionFormOverlay.querySelector('.file-name-display');
const submissionSuccessMessage = submissionFormOverlay.querySelector('.submission-success-message');


// Fonction pour formater le temps (MM:SS)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// ===================================
// 2. Génération dynamique des témoignages
// ===================================
const generateTestimonialCard = (testimonial) => {
    let mediaHtml = '';
    let cardClasses = `testimonial-card reveal-up type-${testimonial.type}`;
    const truncatedContent = testimonial.content.length > 150 ?
        testimonial.content.substring(0, 150) + '...' :
        testimonial.content;

    switch (testimonial.type) {
        case 'text':
            mediaHtml = `
                <i class="fas fa-quote-left quote-icon-lg"></i>
                <div class="testimonial-text-content">
                    <p class="truncated-text">${truncatedContent}</p>
                    ${testimonial.content.length > 150 ? `<button class="read-more-btn">Lire plus</button>` : ''}
                </div>
            `;
            break;
        case 'audio':
            cardClasses += ' has-media';
            mediaHtml = `
                <div class="audio-player-wrapper">
                    <button class="play-pause-btn" data-audio-id="${testimonial.id}">
                        <i class="fas fa-play"></i>
                    </button>
                    <div class="progress-container">
                        <div class="progress-bar"></div>
                    </div>
                </div>
                <div class="time-display">00:00 / 00:00</div>
                <p class="testimonial-quote-text">${testimonial.content}</p>
                <audio src="${testimonial.mediaUrl}" id="audio-${testimonial.id}" preload="none"></audio>
            `;
            break;
        case 'video':
            cardClasses += ' has-media';
            mediaHtml = `
                <div class="video-thumbnail-wrapper" data-video-url="${testimonial.mediaUrl}">
                    <img src="${testimonial.thumbnail}" alt="Vidéo de ${testimonial.name}" class="video-thumbnail" loading="lazy">
                    <div class="video-overlay">
                        <div class="play-btn-lg"><i class="fas fa-play"></i></div>
                    </div>
                </div>
                <p class="testimonial-caption">${testimonial.content}</p>
            `;
            break;
        case 'message':
            mediaHtml = `
                <div class="message-image-wrapper">
                    <img src="${testimonial.content}" alt="Témoignage message" class="message-image" loading="lazy">
                </div>
            `;
            break;
    }

    const card = document.createElement('div');
    card.className = cardClasses;
    card.dataset.id = testimonial.id; // Ajout du data-id ici
    card.innerHTML = `
        ${mediaHtml}
        <div class="testimonial-author-info">
            <img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-author-avatar" loading="lazy">
            <div class="testimonial-author-details">
                <h4>${testimonial.name}</h4>
                <p>${testimonial.role}, ${testimonial.company}</p>
            </div>
        </div>
    `;
    console.log('Card generated:', card);
    return card;
};

const renderTestimonials = (filter = 'all') => {
    console.log('renderTestimonials called with filter:', filter);
    if (!testimonialsGrid) {
        console.error('testimonialsGrid element not found!');
        return;
    }
    testimonialsGrid.innerHTML = ''; // Clear current grid
    const fragment = document.createDocumentFragment();
    
    if (typeof testimonialsData === 'undefined' || testimonialsData === null) {
        console.error('testimonialsData is not available!');
        return;
    }

    testimonialsData.forEach(testimonial => {
        if (filter === 'all' || testimonial.type === filter) {
            console.log('Generating card for:', testimonial.name);
            const card = generateTestimonialCard(testimonial);
            fragment.appendChild(card);
        }
    });
    testimonialsGrid.appendChild(fragment);
    console.log('Appended testimonials to grid. Grid innerHTML length:', testimonialsGrid.innerHTML.length);


    // Initialiser Intersection Observer pour les nouvelles cartes
    initIntersectionObserver();
    // Initialiser les écouteurs pour les médias
    initMediaListeners();
    // Initialiser les "Lire plus"
    initReadMoreButtons();
};

// ===================================
// 3. Filtrage dynamique
// ===================================
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const filter = button.dataset.filter;
        renderTestimonials(filter);
    });
});

// ===================================
// 4. Lecteur audio
// ===================================
function initMediaListeners() {
    testimonialsGrid.querySelectorAll('.testimonial-card.type-audio').forEach(audioCard => {
        const audio = audioCard.querySelector('audio');
        const playPauseBtn = audioCard.querySelector('.play-pause-btn');
        const progressBar = audioCard.querySelector('.progress-bar');
        const progressContainer = audioCard.querySelector('.progress-container');
        const timeDisplay = audioCard.querySelector('.time-display');

        playPauseBtn.addEventListener('click', () => {
            if (audio.paused) {
                // Pause all other audios
                document.querySelectorAll('audio').forEach(otherAudio => {
                    if (otherAudio !== audio && !otherAudio.paused) {
                        otherAudio.pause();
                        // Trouver le bouton play/pause associé pour mettre à jour l'icône
                        const otherAudioCard = otherAudio.closest('.testimonial-card.type-audio');
                        if (otherAudioCard) {
                            otherAudioCard.querySelector('.play-pause-btn').innerHTML = '<i class="fas fa-play"></i>';
                        }
                    }
                });
                audio.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                audio.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });

        audio.addEventListener('timeupdate', () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progress}%`;
            timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
        });

        audio.addEventListener('loadedmetadata', () => {
            timeDisplay.textContent = `00:00 / ${formatTime(audio.duration)}`;
        });

        audio.addEventListener('ended', () => {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            progressBar.style.width = '0%';
            audio.currentTime = 0;
        });

        // Click on progress bar to seek
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const duration = audio.duration;
            audio.currentTime = (clickX / width) * duration;
        });
    });

    // Préchargement audio au hover
    testimonialsGrid.querySelectorAll('.testimonial-card.type-audio').forEach(audioCard => {
        const audio = audioCard.querySelector('audio');
        if (audio) {
            audioCard.addEventListener('mouseenter', () => {
                if (audio.preload === 'none' && !audio.src.startsWith('data:')) { // Avoid re-preloading already loaded or data URIs
                    audio.preload = 'auto';
                    audio.load();
                }
            });
        }
    });
}

// ===================================
// 5. Modals (Vidéo et Image)
// ===================================
// Utilisation de la délégation d'événement pour les thumbnails vidéo et images
testimonialsGrid.addEventListener('click', (e) => {
    const videoThumbnailWrapper = e.target.closest('.video-thumbnail-wrapper');
    const messageImageWrapper = e.target.closest('.message-image-wrapper');

    if (videoThumbnailWrapper) {
        const videoUrl = videoThumbnailWrapper.dataset.videoUrl;
        testimonialVideo.src = videoUrl;
        videoModal.classList.add('open');
        testimonialVideo.play();
    }

    if (messageImageWrapper) {
        const imageUrl = messageImageWrapper.querySelector('.message-image').src;
        modalImage.src = imageUrl;
        imageModal.classList.add('open');
    }
});

// Fermeture du Modal Vidéo
closeModalBtn.addEventListener('click', () => {
    videoModal.classList.remove('open');
    testimonialVideo.pause();
    testimonialVideo.currentTime = 0;
    testimonialVideo.src = ''; // Clear src to prevent background playing
});

videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) { // Click on backdrop
        videoModal.classList.remove('open');
        testimonialVideo.pause();
        testimonialVideo.currentTime = 0;
        testimonialVideo.src = '';
    }
});

// Fermeture du Modal Image
closeImageModalBtn.addEventListener('click', () => {
    imageModal.classList.remove('open');
    modalImage.src = '';
});

imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) { // Click on backdrop
        imageModal.classList.remove('open');
        modalImage.src = '';
    }
});

// Fermeture des modals avec la touche Echap
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (videoModal.classList.contains('open')) {
            videoModal.classList.remove('open');
            testimonialVideo.pause();
            testimonialVideo.currentTime = 0;
            testimonialVideo.src = '';
        }
        if (imageModal.classList.contains('open')) {
            imageModal.classList.remove('open');
            modalImage.src = '';
        }
    }
});


// ===================================
// 6. Bouton "Lire plus"
// ===================================
function initReadMoreButtons() {
    testimonialsGrid.querySelectorAll('.testimonial-card.type-text').forEach(card => {
        const truncatedTextP = card.querySelector('.testimonial-text-content .truncated-text');
        const readMoreBtn = card.querySelector('.read-more-btn');
        if (readMoreBtn && truncatedTextP) {
            const testimonialId = parseInt(card.dataset.id);
            const fullContent = testimonialsData.find(t => t.id === testimonialId).content;
            let isExpanded = false;

            readMoreBtn.addEventListener('click', () => {
                isExpanded = !isExpanded;
                if (isExpanded) {
                    truncatedTextP.textContent = fullContent;
                    readMoreBtn.textContent = 'Lire moins';
                } else {
                    truncatedTextP.textContent = fullContent.substring(0, 150) + '...';
                    readMoreBtn.textContent = 'Lire plus';
                }
            });
        }
    });
}


// ===================================
// 7. Formulaire de soumission flottant
// ===================================
floatingSubmitBtn.addEventListener('click', () => {
    submissionFormOverlay.classList.add('open');
});

function resetForm() {
    submissionFormOverlay.classList.remove('open');
    submissionSuccessMessage.style.display = 'none';
    testimonialForm.reset();

    contentGroup.style.display = 'block';
    fileUploadGroup.style.display = 'none';
    fileMessageGroup.style.display = 'none';

    fileNameDisplay.textContent = '';

    testimonialForm.querySelector('input[name="type"][value="text"]').checked = true;
    testimonialForm.querySelector('#form-content').required = true;
    fileInput.required = false;
}

closeFormBtn.addEventListener('click', resetForm);
submissionFormOverlay.addEventListener('click', (e) => {
    if (e.target === submissionFormOverlay) {
        resetForm();
    }
});

formTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        const value = e.target.value;
        const contentInput = testimonialForm.querySelector('#form-content');

        // Hide all by default, then show the correct one
        contentGroup.style.display = 'none';
        fileUploadGroup.style.display = 'none';
        fileMessageGroup.style.display = 'none';

        // Reset required status
        contentInput.required = false;
        fileInput.required = false;

        switch (value) {
            case 'audio':
            case 'video':
            case 'message':
                fileUploadGroup.style.display = 'block';
                fileInput.required = true;
                break;
            default: // 'text'
                contentGroup.style.display = 'block';
                contentInput.required = true;
                break;
        }
    });
});

testimonialForm.addEventListener('submit', (e) => {
    e.preventDefault();
});

// Drag & Drop pour le fichier (unifié)
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('hover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('hover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('hover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        fileNameDisplay.textContent = files[0].name;
        // Afficher le champ de message facultatif si ce n'est pas un témoignage textuel
        if (testimonialForm.querySelector('input[name="type"]:checked').value !== 'text') {
             fileMessageGroup.style.display = 'block';
        }
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = fileInput.files[0].name;
        if (testimonialForm.querySelector('input[name="type"]:checked').value !== 'text') {
             fileMessageGroup.style.display = 'block';
        }
    } else {
        fileNameDisplay.textContent = '';
        fileMessageGroup.style.display = 'none';
    }
});

// ===================================
// 8. Animations au scroll (Intersection Observer) & Typewriter
// ===================================
const quoteLines = [
    "Les gens oublieront ce que vous avez dit,",
    "ils oublieront ce que vous avez fait,",
    "mais ils n’oublieront jamais ce que vous leur avez fait ressentir."
];
const typewriterElements = [
    document.getElementById('typewriter-line-1'),
    document.getElementById('typewriter-line-2'),
    document.getElementById('typewriter-line-3')
];
const typewriterCursor = document.querySelector('.typewriter-cursor');
const quoteAuthorName = document.getElementById('quote-author-name'); // Référence au nom de l'auteur
let typewriterIntervalId = null; // Pour stocker l'ID de l'intervalle

const typeWriter = (element, text, i, speed, delay, callback) => {
    if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(() => typeWriter(element, text, i, speed, delay, callback), speed);
    } else {
        if (callback) {
            setTimeout(callback, delay); // Délai avant le prochain callback
        }
    }
};

const startTypewriterAnimationCycle = () => {
    // Réinitialiser le contenu des lignes
    typewriterElements.forEach(el => el.innerHTML = '');
    quoteAuthorName.classList.remove('visible'); // Cacher l'auteur au début du cycle
    typewriterCursor.style.animation = 'none'; // Arrêter l'animation du curseur pendant la frappe
    typewriterCursor.style.opacity = '1'; // S'assurer qu'il est visible

    typeWriter(typewriterElements[0], quoteLines[0], 0, 80, 1000, () => { // Ligne 1, 1s de pause
        typeWriter(typewriterElements[1], quoteLines[1], 0, 80, 1000, () => { // Ligne 2, 1s de pause
            typeWriter(typewriterElements[2], quoteLines[2], 0, 80, 2000, () => { // Ligne 3, 2s de pause (statique)
                typewriterCursor.style.animation = 'blinkCursor 0.8s infinite'; // Reprendre le clignotement
                setTimeout(() => {
                    quoteAuthorName.classList.add('visible'); // Afficher l'auteur après un petit délai
                }, 500); // Délai de 0.5 seconde après la fin de la frappe
            });
        });
    });
};


const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.id === 'animated-quote-section') {
                if (!typewriterIntervalId) { // Démarrer l'animation seulement si elle n'est pas déjà en cours
                    startTypewriterAnimationCycle(); // Exécuter une première fois
                    typewriterIntervalId = setInterval(startTypewriterAnimationCycle, 30000); // Répéter toutes les 15s
                }
            } else {
                entry.target.classList.add('visible');
            }
            // Ne plus unobserve pour la section de citation si l'on veut qu'elle puisse se répéter
            // observer.unobserve(entry.target); // Garder pour les autres éléments, mais pas pour la citation si répétition.
        } else {
            // Si la citation n'est plus visible, on peut arrêter l'intervalle si on veut économiser des ressources
            if (entry.target.id === 'animated-quote-section' && typewriterIntervalId) {
                clearInterval(typewriterIntervalId);
                typewriterIntervalId = null;
                typewriterElements.forEach(el => el.innerHTML = ''); // Nettoyer le texte
                typewriterCursor.style.animation = 'none'; // Cacher le curseur
                typewriterCursor.style.opacity = '0';
            }
        }
    });
}, {
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the item is visible
});

const initIntersectionObserver = () => {
    // Observer les cartes de témoignages et les cartes statistiques
    document.querySelectorAll('.testimonials-grid .testimonial-card, .stats-grid .stat-card').forEach(element => {
        observer.observe(element);
    });

    // Observer la section de la citation animée
    const animatedQuoteSection = document.getElementById('animated-quote-section');
    if (animatedQuoteSection) {
        observer.observe(animatedQuoteSection);
    }
};


// ===================================
// 9. Optimisations (Lazy loading & Preload on hover for video)
// ===================================
// Lazy loading for images is handled by `loading="lazy"` attribute in HTML.

// Preload video on hover (handled in initMediaListeners for audios as well)
testimonialsGrid.addEventListener('mouseover', (e) => {
    const videoThumbnailWrapper = e.target.closest('.video-thumbnail-wrapper');
    if (videoThumbnailWrapper) {
        const videoUrl = videoThumbnailWrapper.dataset.videoUrl;
        if (!document.head.querySelector(`link[href="${videoUrl}"][rel="preload"]`)) {
            const link = document.createElement('link');
            link.href = videoUrl;
            link.rel = 'preload';
            link.as = 'video';
            document.head.appendChild(link);
        }
    }
});


// ===================================
// Initialisation de la page
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired.');
    console.log('Calling initial renderTestimonials...');
    renderTestimonials(); // Affiche tous les témoignages par défaut
    initIntersectionObserver(); 
});