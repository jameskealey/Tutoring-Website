// Set minimum date for booking to today
document.addEventListener('DOMContentLoaded', function() {
    const timeInput = document.getElementById('time');
    if (timeInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const hours = String(today.getHours()).padStart(2, '0');
        const minutes = String(today.getMinutes()).padStart(2, '0');
        
        timeInput.min = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    
    // Initialize progress bar
    updateProgressBar(1);
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get('level');
    const subject = urlParams.get('subject');
    const step = urlParams.get('step');
    
    if (level && subject) {
        // Pre-select level and subject
        selectLevel(level);
        selectSubject(subject);
        
        // Navigate to the specified step
        if (step) {
            goToStep(parseInt(step));
        }
    }
    
    // Load Calendly script
    loadCalendlyScript();
});

// Load Calendly script
function loadCalendlyScript() {
    // Check if script is already loaded
    if (document.querySelector('script[src*="calendly.com"]')) {
        return;
    }
    
    // Create script element
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);
    
    // Initialize Calendly when script is loaded
    script.onload = function() {
        // We'll initialize the widget when the user reaches step 4
    };
}

// Subject options for each level
const subjectOptions = {
    gcse: [
        { value: 'maths', text: 'Mathematics', description: 'Core mathematics for GCSE level', price: 'Free' },
        { value: 'further_maths', text: 'Further Mathematics', description: 'Advanced mathematics for GCSE level', price: 'Free' },
        { value: 'business', text: 'Business Studies', description: 'Business concepts and practices', price: 'Free' },
        { value: 'double_science', text: 'Double Award Science', description: 'Combined Biology, Chemistry, and Physics', price: 'Free' },
        { value: 'english_lang', text: 'English Language', description: 'Core English language skills', price: 'Free' },
        { value: 'english_lit', text: 'English Literature', description: 'Analysis of literary texts', price: 'Free' },
        { value: 're', text: 'Religious Education', description: 'Study of religious beliefs and practices', price: 'Free' },
        { value: 'digital_tech', text: 'Digital Technology', description: 'Computing and digital skills', price: 'Free' },
        { value: 'geography', text: 'Geography', description: 'Physical and human geography', price: 'Free' }
    ],
    alevel: [
        { value: 'biology', text: 'Biology', description: 'Advanced biological concepts', price: 'Free' },
        { value: 'business', text: 'Business Studies', description: 'Advanced business concepts', price: 'Free' },
        { value: 'maths', text: 'Mathematics', description: 'Advanced mathematics for A-Level', price: 'Free' }
    ],
    uni: [
        { value: 'micro', text: 'Microeconomics', description: 'Study of individual economic behavior', price: 'Free' },
        { value: 'macro', text: 'Macroeconomics', description: 'Study of economy-wide phenomena', price: 'Free' },
        { value: 'financial_reporting', text: 'Financial Reporting & Analysis', description: 'Analysis of financial statements', price: 'Free' },
        { value: 'actuarial_maths', text: 'Actuarial Mathematics', description: 'Mathematical methods in actuarial science', price: 'Free' },
        { value: 'investment', text: 'Investment Analysis', description: 'Analysis of investment opportunities', price: 'Free' },
        { value: 'actuarial_modelling', text: 'Principles of Actuarial Modelling', description: 'Modelling techniques in actuarial science', price: 'Free' },
        { value: 'general_insurance', text: 'Actuarial Methods in General Insurance', description: 'Insurance risk assessment methods', price: 'Free' },
        { value: 'risk_modelling', text: 'Financial Risk Modelling', description: 'Modelling financial risks', price: 'Free' },
        { value: 'excel', text: 'Excel Analysis', description: 'Advanced Excel for financial analysis', price: 'Free' },
        { value: 'probability', text: 'Probability & Statistics', description: 'Statistical methods and probability theory', price: 'Free' },
        { value: 'statistical_research', text: 'Statistical and Operational Research Methods', description: 'Using R for statistical analysis', price: 'Free' }
    ]
};

// Session type options
const sessionTypes = [
    { 
        value: 'online', 
        text: '🧑‍💻 Online Session', 
        description: 'Held over Zoom or Microsoft Teams. A convenient, flexible option — perfect for most subjects.'
    },
    { 
        value: 'tutor_home', 
        text: '🏠 In-Person at My Home', 
        description: 'Come to me at BT45 7ER. Full address shared upon booking. No extra fee.'
    },
    { 
        value: 'student_home', 
        text: '🚗 In-Person at Your Home', 
        description: 'I come to you! A travel fee of £0.50 per mile (round trip) from BT45 7ER applies. This fee will be added to your booking based on your location.'
    }
];

// Store selected options
let selectedOptions = {
    level: '',
    subject: '',
    sessionType: '',
    price: 'Free',
    isTrial: true
};

// Update progress bar
function updateProgressBar(step) {
    const progressFill = document.getElementById('progressFill');
    
    // Calculate percentage based on 4 total steps (0-3)
    const percentage = ((step - 1) / 3) * 100;
    progressFill.style.width = `${percentage}%`;
    
    // Update step indicators
    for (let i = 1; i <= 4; i++) {
        const stepElement = document.getElementById(`progress${i}`);
        if (i < step) {
            stepElement.classList.add('completed');
            stepElement.classList.remove('active');
        } else if (i === step) {
            stepElement.classList.add('active');
            stepElement.classList.remove('completed');
        } else {
            stepElement.classList.remove('active', 'completed');
        }
    }
    
    // Ensure the progress line is visible
    const progressLine = document.querySelector('.progress-line');
    if (progressLine) {
        progressLine.style.display = 'block';
    }
}

// Update selection display
function updateSelectionDisplay() {
    // Update level selection
    const levelSelection = document.getElementById('levelSelection');
    if (levelSelection && selectedOptions.level) {
        let levelText = '';
        switch(selectedOptions.level) {
            case 'gcse':
                levelText = 'GCSE';
                break;
            case 'alevel':
                levelText = 'A-LEVEL';
                break;
            case 'uni':
                levelText = 'UNIVERSITY';
                break;
            default:
                levelText = selectedOptions.level.charAt(0).toUpperCase() + selectedOptions.level.slice(1);
        }
        levelSelection.textContent = levelText;
    }
    
    // Update subject selection
    const subjectSelection = document.getElementById('subjectSelection');
    if (subjectSelection && selectedOptions.subject) {
        const subjectOption = subjectOptions[selectedOptions.level].find(opt => opt.value === selectedOptions.subject);
        if (subjectOption) {
            subjectSelection.textContent = subjectOption.text;
        }
    }
    
    // Update session type selection
    const sessionTypeSelection = document.getElementById('sessionTypeSelection');
    if (sessionTypeSelection && selectedOptions.sessionType) {
        const sessionType = sessionTypes.find(type => type.value === selectedOptions.sessionType);
        if (sessionType) {
            sessionTypeSelection.textContent = sessionType.text;
        }
    }
    
    // Update time selection
    const timeSelection = document.getElementById('timeSelection');
    if (timeSelection && selectedOptions.time) {
        const date = new Date(selectedOptions.time);
        const formattedDate = date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        timeSelection.textContent = `${formattedDate} at ${formattedTime}`;
    }
}

// Select level and show subjects
function selectLevel(level) {
    selectedOptions.level = level;
    
    // Update UI to show selected button
    document.querySelectorAll('.option-button').forEach(button => {
        button.classList.remove('selected');
        if (button.getAttribute('data-value') === level) {
            button.classList.add('selected');
        }
    });
    
    // Update selection display
    updateSelectionDisplay();
    
    // Show subject options
    showSubjects();
}

// Show subjects based on selected level
function showSubjects() {
    const subjectButtons = document.getElementById('subjectButtons');
    const level = selectedOptions.level;
    
    // Clear existing options
    subjectButtons.innerHTML = '';
    
    if (level) {
        // Add new options based on level
        subjectOptions[level].forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.setAttribute('data-value', option.value);
            button.onclick = function() { selectSubject(option.value); };
            
            const title = document.createElement('span');
            title.className = 'option-title';
            title.textContent = `${option.text} - Free`;
            
            const description = document.createElement('span');
            description.className = 'option-description';
            description.textContent = option.description;
            
            button.appendChild(title);
            button.appendChild(description);
            subjectButtons.appendChild(button);
        });
        
        // Show step 2
        goToStep(2);
    }
}

// Select subject and show session type options
function selectSubject(subject) {
    selectedOptions.subject = subject;
    
    // Update UI to show selected button
    document.querySelectorAll('#subjectButtons .option-button').forEach(button => {
        button.classList.remove('selected');
        if (button.getAttribute('data-value') === subject) {
            button.classList.add('selected');
        }
    });
    
    // Update selection display
    updateSelectionDisplay();
    
    // Show session type options
    showSessionTypes();
}

// Show session type options
function showSessionTypes() {
    const sessionTypeButtons = document.getElementById('sessionTypeButtons');
    
    // Clear existing options
    sessionTypeButtons.innerHTML = '';
    
    // Add a note explaining that free trials are online only
    const noteDiv = document.createElement('div');
    noteDiv.className = 'trial-note';
    noteDiv.innerHTML = '<p><strong>Note:</strong> Free trial sessions are available online only.</p>';
    sessionTypeButtons.appendChild(noteDiv);
    
    // For trial sessions, only show online option
    const typesToShow = sessionTypes.filter(type => type.value === 'online');
    
    // Add session type options
    typesToShow.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.setAttribute('data-value', option.value);
        button.onclick = function() { selectSessionType(option.value); };
        
        const title = document.createElement('span');
        title.className = 'option-title';
        title.textContent = option.text;
        
        const description = document.createElement('span');
        description.className = 'option-description';
        description.textContent = option.description;
        
        button.appendChild(title);
        button.appendChild(description);
        sessionTypeButtons.appendChild(button);
    });
    
    // Show step 3
    goToStep(3);
}

// Select session type and show time selection
function selectSessionType(sessionType) {
    selectedOptions.sessionType = sessionType;
    
    // Update UI to show selected button
    document.querySelectorAll('#sessionTypeButtons .option-button').forEach(button => {
        button.classList.remove('selected');
        if (button.getAttribute('data-value') === sessionType) {
            button.classList.add('selected');
        }
    });
    
    // Update selection display
    updateSelectionDisplay();
    
    // Show time selection
    goToStep(4);
    
    // Initialize Calendly widget for trial session
    initializeCalendlyWidget();
}

// Initialize Calendly widget
function initializeCalendlyWidget() {
    // Make sure Calendly is loaded
    if (typeof Calendly === 'undefined') {
        console.error('Calendly not loaded yet');
        return;
    }
    
    // Clear previous widget if any
    const calendlyContainer = document.getElementById('calendly-embed');
    calendlyContainer.innerHTML = '';
    
    // Use the trial session Calendly URL
    const calendlyUrl = 'https://calendly.com/james1-kealey/free-30-minute-trial-session';
    
    // Format level name
    let formattedLevel = '';
    switch(selectedOptions.level) {
        case 'gcse':
            formattedLevel = 'GCSE';
            break;
        case 'alevel':
            formattedLevel = 'A-Level';
            break;
        case 'uni':
            formattedLevel = 'University';
            break;
        default:
            formattedLevel = selectedOptions.level;
    }
    
    // Format subject name
    let formattedSubject = '';
    const subjectOption = subjectOptions[selectedOptions.level].find(opt => opt.value === selectedOptions.subject);
    if (subjectOption) {
        formattedSubject = subjectOption.text;
    }
    
    // Initialize the widget with full width and height
    Calendly.initInlineWidget({
        url: calendlyUrl,
        parentElement: calendlyContainer,
        prefill: {
            customAnswers: {
                a1: formattedLevel,
                a2: formattedSubject
            }
        },
        utm: {
            utmCampaign: 'website_trial',
            utmSource: 'website',
            utmMedium: 'trial_page'
        },
        hideEventTypeDetails: false,
        hideGdprBanner: true,
        styles: {
            height: '900px',
            minHeight: '900px'
        }
    });
    
    // Add a small delay to ensure the widget is fully rendered
    setTimeout(() => {
        // Force the container to have the correct height
        calendlyContainer.style.minHeight = '900px';
        calendlyContainer.style.height = '900px';
        
        // Find the Calendly iframe and set its height
        const calendlyIframe = calendlyContainer.querySelector('iframe');
        if (calendlyIframe) {
            calendlyIframe.style.height = '900px';
            calendlyIframe.style.minHeight = '900px';
        }
        
        // Ensure the booking container is properly positioned
        const bookingContainer = document.querySelector('.booking-container');
        if (bookingContainer) {
            bookingContainer.style.marginTop = '6rem';
        }
    }, 500);
}

// Navigate to a specific step
function goToStep(step) {
    // Hide all screens
    document.querySelectorAll('.booking-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the selected screen
    document.getElementById(`step${step}`).classList.add('active');
    
    // Update progress bar
    updateProgressBar(step);
    
    // Update back button
    updateBackButton(step);
    
    // Update step title and description
    updateStepHeader(step);
}

// Update back button visibility and text
function updateBackButton(currentStep) {
    const backButton = document.getElementById('backButton');
    
    // Show back button for steps 2-4
    if (currentStep > 1) {
        backButton.style.display = 'block';
        backButton.setAttribute('onclick', `goToPreviousStep(${currentStep})`);
    } else {
        backButton.style.display = 'none';
    }
}

// Go to previous step
function goToPreviousStep(currentStep) {
    // Ensure we don't go below step 1
    if (currentStep <= 1) return;
    
    // Navigate to the previous step
    goToStep(currentStep - 1);
    
    // Update selection display
    updateSelectionDisplay();
}

// Update step title and description in the header
function updateStepHeader(step) {
    const stepTitle = document.getElementById('stepTitle');
    const stepDescription = document.getElementById('stepDescription');
    
    switch(step) {
        case 1:
            stepTitle.textContent = 'Choose Your Level';
            stepDescription.textContent = 'Select the level of tutoring you need';
            break;
        case 2:
            stepTitle.textContent = 'Select Subject';
            stepDescription.textContent = 'Choose the subject for your free trial session';
            break;
        case 3:
            stepTitle.textContent = 'Choose Session Type';
            stepDescription.textContent = 'Select how you want to receive your free trial session';
            break;
        case 4:
            stepTitle.textContent = 'Book Your Free Trial';
            stepDescription.textContent = 'Select a date and time for your free 30-minute trial session';
            break;
    }
}

// Reset the form
function resetForm() {
    // Reset selected options
    selectedOptions = {
        level: '',
        subject: '',
        sessionType: '',
        price: 'Free',
        isTrial: true
    };
    
    // Reset UI
    document.querySelectorAll('.option-button').forEach(button => {
        button.classList.remove('selected');
    });
    
    // Go back to first step
    goToStep(1);
}

// Go to next step
function goToNextStep() {
    const currentStep = getCurrentStep();
    if (currentStep < 4) {
        goToStep(currentStep + 1);
    }
}

// Get current step
function getCurrentStep() {
    for (let i = 1; i <= 4; i++) {
        if (document.getElementById(`step${i}`).classList.contains('active')) {
            return i;
        }
    }
    return 1;
} 