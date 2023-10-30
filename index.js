const locButton = document.querySelector('.loc-button');
const todayInfo = document.querySelector('.today-info');
const prayerElements = {
  fajr: document.querySelector('.prayer-fajr'),
  dhuhr: document.querySelector('.prayer-dhuhr'),
  asr: document.querySelector('.prayer-asr'),
  maghrib: document.querySelector('.prayer-maghrib'),
  isha: document.querySelector('.prayer-isha')
};
const daysList = document.querySelector('.days-list');

function updateCurrentTime(timeZoneOffset) {
  const timeElement = document.getElementById('time');
  const currentTime = new Date().toLocaleTimeString('en', {
    timeZone: timeZoneOffset,
  });
  timeElement.textContent = currentTime;
}

// Update the time immediately when the page loads
updateCurrentTime('EST');

locButton.addEventListener('click', () => {
  const city = prompt("Enter the city:");
  const country = prompt("Enter the country:");
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  // Construct the API URL with the user's input
  const apiUrl = `http://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=${country}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Update the prayer times based on the API response
      prayerElements.fajr.textContent = data.data[0].timings.Fajr;
      prayerElements.dhuhr.textContent = data.data[0].timings.Dhuhr;
      prayerElements.asr.textContent = data.data[0].timings.Asr;
      prayerElements.maghrib.textContent = data.data[0].timings.Maghrib;
      prayerElements.isha.textContent = data.data[0].timings.Isha;

      // Update the rest of the HTML elements (date, location, etc.)
      todayInfo.querySelector('h1').textContent = new Date().toLocaleDateString('en', { weekday: 'long' });
      todayInfo.querySelector('h2').textContent = new Date().toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' });

      const locationElement = todayInfo.querySelector('div > span');
      locationElement.textContent = `${city}, ${country}`;

      const timeZoneOffset = data.data[0].meta.timezone;

      updateCurrentTime(timeZoneOffset);

      setInterval(() => {
        // Get the time zone offset from the API response (replace with the actual API response)
        const timeZoneOffset = data.data[0].meta.timezone;
        // Update the current time with the time zone offset
        updateCurrentTime(timeZoneOffset);
      }, 1000);
    })
    .catch(error => {
      console.error("Error:", error);
    });
});