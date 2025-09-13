// Portfolio Data - Automatically loads from folder structure
// Create folders in images/portfolio/ with filter names as folder names
// Each folder should contain images (cover.jpg, image1.jpg, image2.jpg, etc.)

const portfolioData = {
    // Filter categories - these will be used as folder names
    categories: [
        "Brand Identity",
        "Event Design", 
        "Tech & Gaming",
        "Food & Lifestyle",
        "Personal Projects"
    ],
    
    // Category descriptions for the UI
    categoryDescriptions: {
        "all": "All my flyer designs and promotional materials for small businesses",
        "Brand Identity": "Helping small businesses stand out with logos and flyers that boost branding, visibility, and appeal.",
        "Event Design": "Event flyers, promotional materials, and marketing campaigns",
        "Tech & Gaming": "Tech product flyers, gaming promotions, and digital marketing materials",
        "Food & Lifestyle": "Restaurant and food product flyers, and T-shirt designs",
        "Personal Projects": "Creative explorations, experimental designs, and personal work"
    },
    
    // Button labels for the filters
    categoryLabels: {
        "Brand Identity": "Business Branding",
        "Event Design": "Event Flyers",
        "Tech & Gaming": "Tech Promotions", 
        "Food & Lifestyle": "Restaurant & Lifestyle",
        "Personal Projects": "Creative Projects"
    }
};

// Don't change this line - it makes the data available to other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = portfolioData;
} else {
    window.portfolioData = portfolioData;
}
