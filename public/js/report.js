 // Fetch the API key from localStorage
 const API_KEY = '5d06eb37590d61c048926d8d37b513ac';

 if (!API_KEY) {
     alert('API Key is missing! Please ensure the API key is correctly set.');
     window.location.href = '/'; // Redirect to the main page
 }

 // Retrieve city details from localStorage
 const cityDetails = JSON.parse(localStorage.getItem('cityDetails'));

 if (cityDetails) {
     const { name: cityName, latitude, longitude } = cityDetails;

     if (cityName && latitude && longitude) {
         const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

         fetch(WEATHER_API_URL)
             .then(response => response.json())
             .then(data => {
                 data.cityName = cityName; // Add city name to data for reporting
                 const report = generateRainfallReport(data);
                 document.querySelector(".report-content").textContent = report;
             })
             .catch(error => {
                 console.error("Error fetching weather data:", error);
                 alert("An error occurred while fetching the weather forecast!");
             });
     } else {
         alert("Missing location data. Please return to the main page and try again.");
         window.location.href = '/'; // Redirect to the main page
     }
 } else {
     alert("City details are missing. Please return to the main page and try again.");
     window.location.href = '/'; // Redirect to the main page
 }

 // Function to generate a detailed weather report explaining rainfall predictions
 const generateRainfallReport = (weatherItem) => {
     const cloudCover = weatherItem.clouds.all; // Cloud cover percentage
     const humidity = weatherItem.main.humidity; // Humidity percentage
     const pressure = weatherItem.main.pressure; // Atmospheric pressure in hPa
     const windSpeed = weatherItem.wind.speed; // Wind speed in m/s
     const description = weatherItem.weather[0].description; // Weather description

     // Initialize report with basic weather information
     let report = `**Weather Report for ${weatherItem.cityName}**\n\n`;
     report += `**Condition:** ${description.charAt(0).toUpperCase() + description.slice(1)}\n`;
     report += `**Cloud Cover:** ${cloudCover}%\n`;
     report += `**Humidity:** ${humidity}%\n`;
     report += `**Pressure:** ${pressure} hPa\n`;
     report += `**Wind Speed:** ${windSpeed} m/s\n\n`;

     // Analyzing the data to explain the reason for rainfall or slight rainfall
     report += `**Analysis:**\n`;

     if (cloudCover > 70 && humidity > 80 && pressure < 1010) {
         report += `Rainfall is expected due to the following reasons:\n`;
         report += `- **High Cloud Cover:** With a cloud cover of ${cloudCover}%, the sky is significantly overcast. This means there is a high concentration of clouds capable of producing rain.\n`;
         report += `- **High Humidity:** The humidity level at ${humidity}% indicates that the air is saturated with moisture. High humidity levels often lead to precipitation when combined with sufficient cloud cover.\n`;
         report += `- **Low Atmospheric Pressure:** The atmospheric pressure is relatively low at ${pressure} hPa. Low pressure is typically associated with storm systems and rainfall, as it encourages air to rise and cool, leading to condensation and rain.\n`;
     } else if (cloudCover > 50 && humidity > 60 && pressure < 1020) {
         report += `Slight rainfall is likely due to the following factors:\n`;
         report += `- **Moderate Cloud Cover:** The cloud cover is ${cloudCover}%, which suggests some cloudiness but not enough to cause heavy rain. These clouds may produce light showers.\n`;
         report += `- **Moderate Humidity:** Humidity at ${humidity}% is sufficient to hold moisture in the air, which can result in slight rainfall, especially when combined with moderate cloud cover.\n`;
         report += `- **Slightly Lower Pressure:** The pressure is ${pressure} hPa, which is slightly lower than average. This decrease in pressure can lead to light precipitation as the air begins to cool and condense.\n`;
     } else {
         report += `No significant rainfall is expected due to the following observations:\n`;
         report += `- **Low Cloud Cover:** The cloud cover is only ${cloudCover}%, indicating that the sky is mostly clear with little chance of rain.\n`;
         report += `- **Low Humidity:** With humidity at ${humidity}%, the air is relatively dry, reducing the likelihood of precipitation.\n`;
         report += `- **Stable Atmospheric Pressure:** The pressure is ${pressure} hPa, which is typical for stable weather conditions. High or stable pressure usually prevents cloud formation and rain.\n`;
     }

     report += `\n**Conclusion:** The weather conditions suggest that ${description.includes("rain") ? "rainfall" : "no significant rainfall"} is expected based on the analysis of cloud cover, humidity, and atmospheric pressure.\n`;

     return report;
 };