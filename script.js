document.addEventListener('DOMContentLoaded', function () {
    const rooms = document.querySelectorAll('area.map-room');
    const bookBtn = document.getElementById('bookBtn');
    const clearBookingsBtn = document.getElementById('clearBookings');
    const bookingHistory = document.getElementById('bookingHistory');
    const selectedRoomInput = document.getElementById('selectedRoom');
    const nameInput = document.getElementById('name');
    const dateInput = document.getElementById('date');
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    const availabilityCalendar = document.getElementById('availabilityCalendar');
    const categoryFilter = document.getElementById('categoryFilter');

    const roomData = {
        'Room 1': { category: 'conference', capacity: 10, description: 'Large conference room.' },
        'Room 2': { category: 'meeting', capacity: 5, description: 'Small meeting room.' },
        'Desk 1': { category: 'desk', capacity: 1, description: 'Individual desk.' },
        'Desk 2': { category: 'desk', capacity: 1, description: 'Individual desk.' },
        'Room 3': { category: 'conference', capacity: 8, description: 'Medium conference room.' },
        'Room 4': { category: 'meeting', capacity: 4, description: 'Another small meeting room.' },
        'Room 5': { category: 'meeting', capacity: 6, description: 'Medium meeting room.' },
        'Room 6': { category: 'conference', capacity: 12, description: 'Large executive room.' },
        'Desk 3': { category: 'desk', capacity: 1, description: 'Desk near window.' },
        'Desk 4': { category: 'desk', capacity: 1, description: 'Desk in a quiet corner.' },
        'Desk 5': { category: 'desk', capacity: 1, description: 'Desk near the entrance.' },
        'Desk 6': { category: 'desk', capacity: 1, description: 'Desk near the library.' }
    };

    let bookings = JSON.parse(localStorage.getItem('mapBookings')) || [];

    function updateMapAndHistory() {
        rooms.forEach(room => {
            const roomName = room.alt;
            const isBooked = bookings.some(booking => booking.room === roomName);
            room.style.backgroundColor = isBooked ? 'red' : 'blue';
        });
        updateBookingHistory();
    }

    function updateBookingHistory() {
        bookingHistory.innerHTML = '';
        if (bookings.length === 0) {
            bookingHistory.innerHTML = '<p>No bookings made yet.</p>';
        } else {
            bookings.forEach((booking) => {
                bookingHistory.innerHTML += `
                    <div class="booking-item">
                        <p><strong>${booking.room}</strong> booked by <strong>${booking.name}</strong>
                        on ${booking.date} from ${booking.startTime} to ${booking.endTime}</p>
                    </div>
                `;
            });
        }
    }

    categoryFilter.addEventListener('change', function () {
        const selectedCategory = this.value;
        rooms.forEach(room => {
            const roomName = room.alt;
            const roomInfo = roomData[roomName];
            if (selectedCategory === '' || roomInfo.category === selectedCategory) {
                room.style.display = 'block';
            } else {
                room.style.display = 'none';
            }
        });
    });

    rooms.forEach(room => {
        room.addEventListener('click', function () {
            const roomName = this.alt;
            selectedRoomInput.value = roomName;
        });

        room.addEventListener('mouseover', function () {
            const roomName = this.alt;
            const roomInfo = roomData[roomName];
            const tooltip = document.createElement('div');
            tooltip.classList.add('room-tooltip');
            tooltip.innerHTML = `<strong>${roomName}</strong><br>Capacity: ${roomInfo.capacity}<br>${roomInfo.description}`;
            room.appendChild(tooltip);
            tooltip.style.display = 'block';
        });

        room.addEventListener('mouseout', function () {
            const tooltip = this.querySelector('.room-tooltip');
            if (tooltip) tooltip.remove();
        });
    });

    bookBtn.addEventListener('click', function () {
        const name = nameInput.value;
        const room = selectedRoomInput.value;
        const date = dateInput.value;
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;

        if (name === '' || room === '' || date === '' || startTime === '' || endTime === '') {
            alert('Please complete all fields.');
            return;
        }

        const isConflict = bookings.some(booking => booking.room === room && booking.date === date &&
            ((startTime >= booking.startTime && startTime < booking.endTime) ||
            (endTime > booking.startTime && endTime <= booking.endTime)));

        if (isConflict) {
            alert('This room/desk is already booked for the selected time slot.');
            return;
        }

        bookings.push({ name, room, date, startTime, endTime });
        alert(`${room} has been booked successfully!`);

        localStorage.setItem('mapBookings', JSON.stringify(bookings));

        nameInput.value = '';
        selectedRoomInput.value = '';
        dateInput.value = '';
        startTimeInput.value = '';
        endTimeInput.value = '';

        updateMapAndHistory();
    });

    clearBookingsBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to clear all bookings?')) {
            bookings = [];
            localStorage.setItem('mapBookings', JSON.stringify(bookings));
            updateMapAndHistory();
        }
    });

    updateMapAndHistory();
});

