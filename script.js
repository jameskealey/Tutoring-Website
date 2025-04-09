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
        
        // Find the subject price
        const subjectOption = subjectOptions[level].find(opt => opt.value === subject);
        const price = subjectOption ? subjectOption.price : 0;
        
        // Select subject with the correct price
        selectSubject(subject, price);
        
        // Navigate to the specified step
        if (step) {
            goToStep(parseInt(step));
        }
    } else {
        // If no level and subject are specified, show the first level's subjects
        const firstLevel = Object.keys(subjectOptions)[0];
        if (firstLevel) {
            showSubjects(firstLevel);
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
        { value: 'maths', text: 'Mathematics', description: 'Core mathematics for GCSE level', price: 20 },
        { value: 'further_maths', text: 'Further Mathematics', description: 'Advanced mathematics for GCSE level', price: 20 },
        { value: 'business', text: 'Business Studies', description: 'Business concepts and practices', price: 15 },
        { value: 'double_science', text: 'Double Award Science', description: 'Combined Biology, Chemistry, and Physics', price: 15 },
        { value: 'english_lang', text: 'English Language', description: 'Core English language skills', price: 15 },
        { value: 'english_lit', text: 'English Literature', description: 'Analysis of literary texts', price: 15 },
        { value: 're', text: 'Religious Education', description: 'Study of religious beliefs and practices', price: 15 },
        { value: 'digital_tech', text: 'Digital Technology', description: 'Computing and digital skills', price: 15 },
        { value: 'geography', text: 'Geography', description: 'Physical and human geography', price: 15 }
    ],
    alevel: [
        { value: 'biology', text: 'Biology', description: 'Advanced biological concepts', price: 30 },
        { value: 'business', text: 'Business Studies', description: 'Advanced business concepts', price: 30 },
        { value: 'maths', text: 'Mathematics', description: 'Advanced mathematics for A-Level', price: 30 }
    ],
    uni: [
        { value: 'micro', text: 'Microeconomics', description: 'Study of individual economic behavior', price: 40 },
        { value: 'macro', text: 'Macroeconomics', description: 'Study of economy-wide phenomena', price: 40 },
        { value: 'financial_reporting', text: 'Financial Reporting & Analysis', description: 'Analysis of financial statements', price: 40 },
        { value: 'actuarial_maths', text: 'Actuarial Mathematics', description: 'Mathematical methods in actuarial science', price: 40 },
        { value: 'investment', text: 'Investment Analysis', description: 'Analysis of investment opportunities', price: 40 },
        { value: 'actuarial_modelling', text: 'Principles of Actuarial Modelling', description: 'Modelling techniques in actuarial science', price: 40 },
        { value: 'general_insurance', text: 'Actuarial Methods in General Insurance', description: 'Insurance risk assessment methods', price: 40 },
        { value: 'risk_modelling', text: 'Financial Risk Modelling', description: 'Modelling financial risks', price: 40 },
        { value: 'excel', text: 'Excel Analysis', description: 'Advanced Excel for financial analysis', price: 40 },
        { value: 'probability', text: 'Probability & Statistics', description: 'Statistical methods and probability theory', price: 40 },
        { value: 'statistical_research', text: 'Statistical and Operational Research Methods', description: 'Using R for statistical analysis', price: 40 }
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
        description: 'Come to me in Draperstown, Co. Derry. Full address shared upon booking. No travel fee.'
    },
    { 
        value: 'student_home', 
        text: '🚗 In-Person at Your Home', 
        description: 'I come to you! A travel fee applies based on your location. Enter your address to calculate the fee.'
    }
];

// Store selected options
let selectedOptions = {
    level: '',
    subject: '',
    sessionType: '',
    price: 0
};

// Update progress bar
function updateProgressBar(step) {
    // Update step indicators
    for (let i = 1; i <= 5; i++) {
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
}

// Update selection summary
function updateSelectionSummary() {
    const levelSelection = document.getElementById('levelSelection');
    const subjectSelection = document.getElementById('subjectSelection');
    const sessionTypeSelection = document.getElementById('sessionTypeSelection');
    const timeSelection = document.getElementById('timeSelection');
    
    if (selectedOptions.level) {
        levelSelection.textContent = selectedOptions.level.charAt(0).toUpperCase() + selectedOptions.level.slice(1);
    } else {
        levelSelection.textContent = '';
    }
    
    if (selectedOptions.subject) {
        subjectSelection.textContent = selectedOptions.subject;
    } else {
        subjectSelection.textContent = '';
    }
    
    if (selectedOptions.sessionType) {
        const sessionType = sessionTypes.find(type => type.value === selectedOptions.sessionType);
        sessionTypeSelection.textContent = sessionType ? sessionType.text : '';
    } else {
        sessionTypeSelection.textContent = '';
    }
    
    if (selectedOptions.time) {
        const date = new Date(selectedOptions.time);
        const formattedDate = date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        timeSelection.textContent = `${formattedDate} at ${formattedTime}`;
    } else {
        timeSelection.textContent = '';
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
                levelText = selectedOptions.level.toUpperCase();
        }
        levelSelection.textContent = levelText;
    }
    
    // Update subject selection
    const subjectSelection = document.getElementById('subjectSelection');
    if (subjectSelection && selectedOptions.subject && selectedOptions.level) {
        const subjectOption = subjectOptions[selectedOptions.level].find(opt => opt.value === selectedOptions.subject);
        if (subjectOption) {
            subjectSelection.textContent = `${subjectOption.text} (£${subjectOption.price} p/h)`;
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
    document.querySelectorAll('#step1 .option-button').forEach(button => {
        button.classList.remove('selected');
        if (button.getAttribute('data-value') === level) {
            button.classList.add('selected');
        }
    });
    
    // Update progress bar
    updateProgressBar(2);
    
    // Update selection display
    updateSelectionDisplay();
    
    // Show subject options
    showSubjects(level);
    
    // Go to next step
    goToStep(2);
}

// Show subjects based on selected level
function showSubjects(level) {
    const subjectButtons = document.getElementById('subjectButtons');
    subjectButtons.innerHTML = '';
    
    // Get URL parameters to check if a subject is pre-selected
    const urlParams = new URLSearchParams(window.location.search);
    const preSelectedSubject = urlParams.get('subject');
    
    // Make sure we have subjects for this level
    if (!subjectOptions[level] || subjectOptions[level].length === 0) {
        console.error(`No subjects found for level: ${level}`);
        return;
    }
    
    subjectOptions[level].forEach(subject => {
        // Make sure the subject has a price
        if (typeof subject.price !== 'number' || isNaN(subject.price)) {
            console.error(`Invalid price for subject: ${subject.text}`);
            subject.price = 0; // Set a default price if missing
        }
        
        const button = document.createElement('button');
        button.className = 'option-button';
        button.setAttribute('data-value', subject.value);
        button.setAttribute('data-price', subject.price);
        button.onclick = () => selectSubject(subject.value, subject.price);
        
        // If this is the pre-selected subject, add the selected class
        if (preSelectedSubject === subject.value) {
            button.classList.add('selected');
        }
        
        const title = document.createElement('span');
        title.className = 'option-title';
        title.textContent = subject.text;
        
        const description = document.createElement('span');
        description.className = 'option-description';
        description.textContent = subject.description;
        
        const price = document.createElement('span');
        price.className = 'option-price';
        price.textContent = `£${subject.price} p/h`;
        
        button.appendChild(price);
        button.appendChild(title);
        button.appendChild(description);
        
        subjectButtons.appendChild(button);
    });
}

// Select subject and show session type options
function selectSubject(subject, price) {
    // Validate price
    if (typeof price !== 'number' || isNaN(price)) {
        console.error(`Invalid price for subject: ${subject}`);
        price = 0; // Set a default price if missing
    }
    
    selectedOptions.subject = subject;
    selectedOptions.price = price;
    
    // Update UI
    document.querySelectorAll('#step2 .option-button').forEach(button => {
        button.classList.remove('selected');
        if (button.getAttribute('data-value') === subject) {
            button.classList.add('selected');
        }
    });
    
    // Update progress bar
    updateProgressBar(3);
    
    // Update selection display
    updateSelectionDisplay();
    
    // Update subtotal display
    updateTotalPrice();
    
    // Show session type options and go to next step
    showSessionTypes();
    goToStep(3);
}

// Show session type options
function showSessionTypes() {
    const sessionTypeButtons = document.getElementById('sessionTypeButtons');
    
    // Clear existing options
    sessionTypeButtons.innerHTML = '';
    
    // Add session type options
    sessionTypes.forEach(option => {
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
    
    // Initialize navigation buttons
    const screenNavigation = document.querySelector('#step3 .screen-navigation');
    if (screenNavigation) {
        // Initially hide the navigation buttons
        screenNavigation.style.display = 'none';
    }
    
    // Show step 3
    goToStep(3);
}

const TUTOR_ADDRESS = '15 Moneyneany Lane, Draperstown, Magherafelt, BT45 7ER';
let travelFee = 0;

function selectSessionType(type) {
    selectedOptions.sessionType = type;
    updateSelectionDisplay();
    
    // Show address input if in-person at student's home is selected
    const addressInput = document.getElementById('addressInput');
    if (type === 'student_home') {
        addressInput.style.display = 'block';
        
        // Change the input placeholder text
        const userAddressInput = document.getElementById('userAddress');
        if (userAddressInput) {
            userAddressInput.placeholder = 'Enter your home address';
        }
        
        // Initialize Google Places Autocomplete
        const input = document.getElementById('userAddress');
        const autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.setFields(['formatted_address']);
        
        // Change the button text to "Continue"
        const calculateButton = document.getElementById('calculateFee');
        if (calculateButton) {
            calculateButton.textContent = 'Continue';
            calculateButton.onclick = function() {
                // Store the address for later use
                const userAddress = document.getElementById('userAddress').value;
                if (userAddress) {
                    // Store the address in selectedOptions
                    selectedOptions.address = userAddress;
                    
                    // Calculate travel fee in the background without displaying it
                    calculateTravelFeeBackground(userAddress);
                    
                    // Proceed to next step
                    goToStep(4);
                }
            };
        }
        
        // Hide the travel fee result div
        const resultDiv = document.getElementById('travelFeeResult');
        if (resultDiv) {
            resultDiv.style.display = 'none';
        }
        
        // Hide the navigation buttons for student_home option
        const screenNavigation = document.querySelector('#step3 .screen-navigation');
        if (screenNavigation) {
            screenNavigation.style.display = 'none';
        }
    } else {
        addressInput.style.display = 'none';
        travelFee = 0;
        selectedOptions.address = ''; // Clear any stored address
        updateTotalPrice();
        
        // Show the next step button for online and tutor_home options
        const screenNavigation = document.querySelector('#step3 .screen-navigation');
        if (screenNavigation) {
            screenNavigation.style.display = 'block';
        }
        
        // Go to step 4 (summary) for online and tutor_home options
        goToStep(4);
    }
    
    // Update UI to show selected button
    document.querySelectorAll('#sessionTypeButtons .option-button').forEach(button => {
        button.classList.remove('selected');
        if (button.getAttribute('data-value') === type) {
            button.classList.add('selected');
        }
    });
}

// Calculate travel fee in the background without displaying it
function calculateTravelFeeBackground(userAddress) {
    if (!userAddress) {
        return;
    }
    
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: [userAddress],
        destinations: [TUTOR_ADDRESS],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }, (response, status) => {
        if (status === 'OK') {
            const distance = response.rows[0].elements[0].distance.text;
            const miles = parseFloat(distance.replace(' mi', ''));
            // Calculate round trip fee (£1 per mile, rounded up)
            travelFee = Math.ceil(miles * 2);
            updateTotalPrice();
            updateSummaryDisplay(); // Ensure summary is updated with the correct travel fee
            
            // Store the address for later use
            selectedOptions.address = userAddress;
        }
    });
}

function updateTotalPrice() {
    const basePrice = selectedOptions.price || 0;
    const totalPrice = basePrice + travelFee;
    
    // Update subtotal display only
    const subtotalDisplay = document.getElementById('subtotalAmount');
    if (subtotalDisplay) {
        subtotalDisplay.textContent = `£${totalPrice}`;
        // Add a subtle animation to make the update more noticeable
        subtotalDisplay.classList.add('price-updated');
        setTimeout(() => {
            subtotalDisplay.classList.remove('price-updated');
        }, 500);
    }
}

// Navigate to a specific step
function goToStep(step) {
    // Reset fees based on which step we're going to
    if (step === 1) {
        // Going to step 1 - reset both travel fee and lesson fee
        travelFee = 0;
        selectedOptions.price = 0;
        updateTotalPrice();
    } else if (step === 2) {
        // Going to step 2 - reset travel fee
        travelFee = 0;
        updateTotalPrice();
    }
    
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
    
    // Call updateSummaryDisplay when reaching step 4
    if (step === 4) {
        updateSummaryDisplay();
    }
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
    
    // Clear values based on which step we're going back from
    if (currentStep === 5) {
        // Going back from step 5 (time) to step 4 (summary)
        // No need to clear anything since summary doesn't have inputs
        document.getElementById('timeSelection').textContent = '';
    } else if (currentStep === 4) {
        // Going back from step 4 (summary) to step 3 (session type)
        // Clear payment method selection
        selectedOptions.paymentMethod = '';
        document.querySelectorAll('.payment-button').forEach(button => {
            button.classList.remove('selected');
        });
        document.getElementById('summarySelection').textContent = '';
    } else if (currentStep === 3) {
        // Going back from step 3 (session type) to step 2 (subject)
        // Clear session type selection
        selectedOptions.sessionType = '';
        document.querySelectorAll('#sessionTypeButtons .option-button').forEach(button => {
            button.classList.remove('selected');
        });
        // Reset travel fee
        travelFee = 0;
        updateTotalPrice();
        document.getElementById('sessionTypeSelection').textContent = '';
    } else if (currentStep === 2) {
        // Going back from step 2 (subject) to step 1 (level)
        // Clear subject selection
        selectedOptions.subject = '';
        selectedOptions.price = 0;
        document.querySelectorAll('#subjectButtons .option-button').forEach(button => {
            button.classList.remove('selected');
        });
        updateTotalPrice();
        document.getElementById('subjectSelection').textContent = '';
    }
    
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
            stepDescription.textContent = 'Choose the subject you want tutoring in';
            break;
        case 3:
            stepTitle.textContent = 'Choose Session Type';
            stepDescription.textContent = 'Select how you want to receive tutoring';
            break;
        case 4:
            stepTitle.textContent = 'Booking Summary';
            stepDescription.textContent = 'Review your booking and select payment method';
            break;
        case 5:
            stepTitle.textContent = 'Book Your Session';
            stepDescription.textContent = 'Select a date and time for your tutoring session';
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
        price: 0
    };
    
    // Reset UI
    document.querySelectorAll('.option-button').forEach(button => {
        button.classList.remove('selected');
    });
    
    // Go back to first step
    goToStep(1);
}

// Get current step
function getCurrentStep() {
    for (let i = 1; i <= 5; i++) {
        if (document.getElementById(`step${i}`).classList.contains('active')) {
            return i;
        }
    }
    return 1;
}

// Go to next step
function goToNextStep() {
    const currentStep = getCurrentStep();
    if (currentStep < 5) {
        goToStep(currentStep + 1);
    }
}

// Update selections display
function updateSelections() {
    document.getElementById('levelSelection').textContent = selectedOptions.level ? selectedOptions.level.toUpperCase() : '';
    
    // Find the subject text from the options
    let subjectText = '';
    if (selectedOptions.level && selectedOptions.subject) {
        const subject = subjectOptions[selectedOptions.level].find(s => s.value === selectedOptions.subject);
        if (subject) {
            subjectText = `${subject.text} (£${subject.price})`;
        }
    }
    document.getElementById('subjectSelection').textContent = subjectText;
    
    document.getElementById('sessionTypeSelection').textContent = selectedOptions.sessionType ? 
        (sessionTypes.find(type => type.value === selectedOptions.sessionType)?.text || '') : '';
    document.getElementById('timeSelection').textContent = selectedOptions.time || '';
}

// Show time selection and initialize Calendly
function showTimeSelection() {
    // Update progress bar
    updateProgressBar(5);
    
    // Update selection display
    updateSelectionDisplay();
    
    // Go to step 5 (calendly)
    goToStep(5);
    
    // Initialize Calendly with all the required information
    initializeCalendlyWidget();
}

// Update summary display
function updateSummaryDisplay() {
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
    
    // Format subject name without price
    let formattedSubject = '';
    const subjectOption = subjectOptions[selectedOptions.level].find(opt => opt.value === selectedOptions.subject);
    if (subjectOption) {
        formattedSubject = subjectOption.text.split(' (£')[0]; // Remove price
    }
    
    // Format session type
    let formattedSessionType = '';
    switch(selectedOptions.sessionType) {
        case 'online':
            formattedSessionType = 'Online Session';
            break;
        case 'tutor_home':
            formattedSessionType = 'In-Person at Tutor\'s Home';
            break;
        case 'student_home':
            formattedSessionType = 'In-Person at Student\'s Home';
            break;
        default:
            formattedSessionType = selectedOptions.sessionType;
    }
    
    // Update summary elements
    document.getElementById('summaryLevel').textContent = formattedLevel;
    document.getElementById('summarySubject').textContent = formattedSubject;
    document.getElementById('summarySessionType').textContent = formattedSessionType;
    document.getElementById('summaryLessonFee').textContent = `£${selectedOptions.price}`;
    
    // Conditionally display travel fee
    const travelFeeContainer = document.getElementById('summaryTravelFeeContainer');
    const summaryTravelFee = document.getElementById('summaryTravelFee');
    if (travelFee > 0) {
        travelFeeContainer.style.display = 'flex';
        summaryTravelFee.textContent = `£${travelFee}`;
    } else {
        travelFeeContainer.style.display = 'none';
    }
    
    // Update total
    const total = selectedOptions.price + (selectedOptions.sessionType === 'student_home' ? travelFee : 0);
    document.getElementById('summaryTotal').textContent = `£${total}`;
    
    // Show/hide payment options based on session type
    const inPersonPayButton = document.querySelector('.payment-button[onclick*="in_person"]');
    const onlinePayButton = document.querySelector('.payment-button[onclick*="online"]');
    
    if (selectedOptions.sessionType === 'online') {
        // Only show online payment for online sessions
        if (inPersonPayButton) inPersonPayButton.style.display = 'none';
        if (onlinePayButton) onlinePayButton.style.display = 'block';
        
        // Highlight the online payment option but don't auto-proceed
        document.querySelectorAll('.payment-button').forEach(button => {
            button.classList.remove('selected');
            if (button.getAttribute('onclick').includes('online')) {
                button.classList.add('selected');
            }
        });
        selectedOptions.paymentMethod = 'online';
    } else {
        // Show both payment options for in-person sessions
        if (inPersonPayButton) inPersonPayButton.style.display = 'block';
        if (onlinePayButton) onlinePayButton.style.display = 'block';
        
        // Clear payment selection
        document.querySelectorAll('.payment-button').forEach(button => {
            button.classList.remove('selected');
        });
        selectedOptions.paymentMethod = '';
    }
}

// Select payment method
function selectPaymentMethod(method) {
    selectedOptions.paymentMethod = method;
    
    // Update UI
    document.querySelectorAll('.payment-button').forEach(button => {
        button.classList.remove('selected');
        if (button.getAttribute('onclick').includes(method)) {
            button.classList.add('selected');
        }
    });
    
    // Update summary selection display
    document.getElementById('summarySelection').textContent = 
        method === 'online' ? 'Online Payment' : 'In-Person Payment';
    
    // Proceed to Calendly
    showTimeSelection();
}

// Proceed with phone number input
function proceedWithPhoneNumber() {
    // Validate and store phone number
    validateAndStorePhoneNumber();
    
    // Proceed to Calendly
    showTimeSelection();
}

// Validate and store phone number
function validateAndStorePhoneNumber() {
    const phoneNumber = document.getElementById('userPhoneNumber').value;
    if (selectedOptions.paymentMethod === 'online' && phoneNumber) {
        selectedOptions.phoneNumber = phoneNumber;
    }
}

// Edit description text on the 'Pay In Person' button
const payInPersonButton = document.querySelector('.payment-button[onclick*="in_person"] .payment-description');
if (payInPersonButton) {
    payInPersonButton.textContent = 'Pay with cash or card at the session';
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
    
    // Determine which Calendly event type to use based on session type
    let calendlyUrl = '';
    
    if (selectedOptions.sessionType === 'online') {
        calendlyUrl = 'https://calendly.com/james1-kealey/online-tutoring';
    } else if (selectedOptions.sessionType === 'tutor_home') {
        calendlyUrl = 'https://calendly.com/james1-kealey/tutor-home-tutoring';
    } else if (selectedOptions.sessionType === 'student_home') {
        calendlyUrl = 'https://calendly.com/james1-kealey/student-home-tutoring';
    }
    
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
    
    // Get student address if applicable
    let studentAddress = '';
    if (selectedOptions.sessionType === 'student_home') {
        const addressInput = document.getElementById('userAddress');
        if (addressInput) {
            studentAddress = addressInput.value;
        }
    }
    
    // Get lesson fee and travel fee
    const lessonFee = selectedOptions.price || 0;
    const travelFeeDisplay = travelFee > 0 ? `£${travelFee}` : '£0';
    const totalFee = lessonFee + (selectedOptions.sessionType === 'student_home' ? travelFee : 0);
    
    // Initialize the widget with full width and height
    Calendly.initInlineWidget({
        url: calendlyUrl,
        parentElement: calendlyContainer,
        prefill: {
            customAnswers: {
                a2: formattedLevel,
                a3: formattedSubject,
                a4: studentAddress,
                a5: `£${lessonFee}`,
                a6: travelFeeDisplay,
                a7: `£${totalFee}`,
                a8: selectedOptions.paymentMethod === 'online' ? 'Online Payment' : 'In-Person Payment'
            }
        },
        utm: {
            utmCampaign: 'website_booking',
            utmSource: 'website',
            utmMedium: 'booking_page'
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
