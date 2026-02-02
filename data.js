// data.js

const testimonialsData = [
    // Témoignages Écrits
    {
        id: 1,
        type: 'text',
        name: 'Jean Dupont',
        role: 'CEO',
        company: 'InnovCorp',
        content: "NanNan Com a transformé notre présence en ligne. Leur stratégie digitale a été d'une efficacité redoutable, et nous avons constaté une augmentation significative de notre engagement client. L'équipe est professionnelle, créative et toujours à l'écoute. Nous recommandons vivement leurs services pour toute entreprise cherchant à innover et à se démarquer dans le paysage numérique actuel. C'est un partenaire de confiance sur lequel nous pouvons toujours compter.",
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        id: 2,
        type: 'text',
        name: 'Marie Curie',
        role: 'Directrice Marketing',
        company: 'LuxSolutions',
        content: "Grâce à NanNan Com, nos campagnes marketing ont atteint de nouveaux sommets. Leur approche innovante et leur maîtrise des outils numériques ont été cruciales pour notre croissance. Le suivi est impeccable et les résultats sont au-delà de nos attentes. La collaboration avec leur équipe est un véritable plaisir, ils sont réactifs et apportent toujours des solutions pertinentes. Un grand merci pour votre excellent travail !",
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        id: 3,
        type: 'text',
        name: 'Ahmed Benali',
        role: 'Fondateur',
        company: 'TechGenius',
        content: "Le développement de notre application mobile par NanNan Com a été un succès retentissant. Ils ont su traduire notre vision en un produit fonctionnel et esthétique. Leur expertise technique est indéniable, et leur gestion de projet est exemplaire. Nous sommes très satisfaits du résultat et des délais respectés. Une équipe jeune, dynamique et très compétente que je ne peux que recommander.",
        image: 'assets/Temoignage/coolcat.avif'
    },

    // Témoignages Audio
    {
        id: 4,
        type: 'audio',
        name: 'Sophie Dubois',
        role: 'Chef de Projet',
        company: 'UrbanTech',
        content: "La production de notre podcast d'entreprise par NanNan Com a été un grand succès. La qualité sonore est impeccable, et le montage très professionnel. Ils ont parfaitement capturé l'essence de notre marque. C'est un plaisir de travailler avec eux.",
        image: 'assets/Temoignage/chillcat.jpg'
    },
    
    {
        id: 5,
        type: 'audio',
        name: 'Marc Leclerc',
        role: 'Directeur Commercial',
        company: 'GlobalLogistics',
        content: "Nous avions besoin d'une voix off percutante pour notre publicité radio, et NanNan Com a livré un travail exceptionnel. Leurs conseils ont été précieux, et le résultat final a dépassé nos attentes. Service rapide et de qualité !",
        image: 'assets/Temoignage/chillcat.jpg',
        mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },

    // Témoignages Vidéo
    {
        id: 6,
        type: 'video',
        name: 'Fatima Zahra',
        role: 'Responsable Communication',
        company: 'GreenHarvest',
        content: "La vidéo institutionnelle réalisée par NanNan Com est magnifique. Ils ont su raconter notre histoire avec émotion et professionnalisme. Une équipe talentueuse et passionnée.",
       image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100&h=100&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        mediaUrl: 'assets/Temoignage/casio.mp4', // Votre vidéo locale
       thumbnail: 'assets/Temoignage/montrepl.jpg', // Conserve la miniature Unsplash pour l'instant
    },
    {
        id: 7,
        type: 'video',
        name: 'Paul Martin',
        role: 'Chef de produit',
        company: 'HealthConnect',
        content: "La campagne vidéo pour le lancement de notre nouveau produit a généré un impact incroyable. NanNan Com a su créer un contenu captivant et parfaitement adapté à notre cible. Bravo à toute l'équipe !",
       image:'assets/Temoignage/chillcat.jpg',
        mediaUrl: 'assets/Temoignage/douille.mp4', // Votre autre vidéo locale
       thumbnail: 'assets/Temoignage/douilleplein.jpg',
    },

    // Témoignages Messages
    {
        id: 8,
        type: 'message',
        name: 'Sarah Kante',
        role: 'Community Manager',
        company: 'FashionHub',
        content: 'assets/Temoignage/screen.jpg', // Placeholder image for message
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        id: 9,
        type: 'message',
        name: 'David Ngoma',
        role: 'Gérant',
        company: 'LocalBistro',
        content: 'assets/Temoignage/screen.jpg', // Placeholder image for message
       image: 'assets/Temoignage/coolcat.avif'
    }
];

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        testimonialsData
    };
}
