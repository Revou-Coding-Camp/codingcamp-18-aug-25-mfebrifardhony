document.addEventListener('DOMContentLoaded', () => {
    // ---- DEBUGGING: Konfirmasi bahwa skrip dimuat ----
    console.log("Skrip berhasil dimuat. DOM content sudah diload.");

    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const dateInput = document.getElementById('date-input');
    const taskList = document.getElementById('task-list');
    const noTaskMessage = document.getElementById('no-task-message');
    const filterButton = document.getElementById('filter-button');
    const deleteAllButton = document.getElementById('delete-all-button');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all'; // all, in-progress, completed

    // ---- DEBUGGING: Cek data awal dari Local Storage ----
    console.log("Data tasks saat startup:", tasks);

    // Fungsi untuk menyimpan data ke Local Storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        // ---- DEBUGGING: Konfirmasi data tersimpan ----
        console.log("Data tasks berhasil disimpan:", tasks);
    }

    // Fungsi untuk menampilkan daftar tugas
    function renderTasks() {
        // ---- DEBUGGING: Menampilkan tasks yang sedang dirender ----
        console.log("Memulai rendering tugas. Filter saat ini:", currentFilter);
        
        // Hapus semua task yang sudah ada
        const taskItems = taskList.querySelectorAll('li:not(#no-task-message)');
        taskItems.forEach(item => item.remove());
        
        // Tentukan task mana yang akan ditampilkan berdasarkan filter
        let tasksToRender = tasks;
        if (currentFilter === 'in-progress') {
            tasksToRender = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            tasksToRender = tasks.filter(task => task.completed);
        }
        
        // Tampilkan atau sembunyikan pesan "No task found"
        noTaskMessage.style.display = tasksToRender.length > 0 ? 'none' : 'block';

        tasksToRender.forEach((task, index) => {
            const li = document.createElement('li');
            li.classList.add('task-item');
            if (task.completed) {
                li.classList.add('completed');
            }

            const formattedDate = task.date ? new Date(task.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : 'N/A';
            const statusText = task.completed ? 'Selesai' : 'Aktif';
            const statusClass = task.completed ? 'completed' : 'in-progress';

            li.innerHTML = `
                <span class="task-text">${task.text}</span>
                <span class="task-date">${formattedDate}</span>
                <span class="status-badge ${statusClass}">${statusText}</span>
                <span class="action-buttons">
                    <button class="toggle-button" data-index="${tasks.indexOf(task)}">✓</button>
                    <button class="delete-button" data-index="${tasks.indexOf(task)}">x</button>
                </span>
            `;
            
            taskList.appendChild(li);
        });
        
        // ---- DEBUGGING: Akhir rendering ----
        console.log("Rendering selesai. Total tugas yang ditampilkan:", tasksToRender.length);
    }

    // Fungsi untuk validasi dan menambah tugas
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        const taskDate = dateInput.value;

        // Validasi input
        if (taskText === '') {
            // ---- DEBUGGING: Pesan jika validasi gagal ----
            console.warn("Peringatan: Input tugas kosong. Penambahan dibatalkan.");
            alert('Tugas tidak boleh kosong!');
            return;
        }

        const newTask = {
            text: taskText,
            date: taskDate,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        dateInput.value = '';
        // ---- DEBUGGING: Konfirmasi tugas baru ditambahkan ----
        console.log("Tugas baru ditambahkan:", newTask);
    });

    // Fungsi untuk menghapus atau menandai selesai
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-button')) {
            const index = e.target.getAttribute('data-index');
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
            // ---- DEBUGGING: Konfirmasi tugas dihapus ----
            console.log(`Tugas dengan index ${index} berhasil dihapus.`);
        } else if (e.target.classList.contains('toggle-button')) {
            const index = e.target.getAttribute('data-index');
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
            // ---- DEBUGGING: Konfirmasi status tugas diubah ----
            console.log(`Status tugas dengan index ${index} diubah menjadi ${tasks[index].completed}.`);
        }
    });

    // Fungsi untuk filter
    filterButton.addEventListener('click', () => {
        if (currentFilter === 'all') {
            currentFilter = 'in-progress';
            filterButton.textContent = 'AKTIF';
        } else if (currentFilter === 'in-progress') {
            currentFilter = 'completed';
            filterButton.textContent = 'SELESAI';
        } else {
            currentFilter = 'all';
            filterButton.textContent = 'FILTER';
        }
        renderTasks();
        // ---- DEBUGGING: Konfirmasi filter diubah ----
        console.log(`Filter diubah menjadi: ${currentFilter}`);
    });

    // Fungsi untuk menghapus semua tugas
    deleteAllButton.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin menghapus semua tugas?')) {
            tasks = [];
            saveTasks();
            renderTasks();
            // ---- DEBUGGING: Konfirmasi semua tugas dihapus ----
            console.log("Semua tugas berhasil dihapus.");
        }
    });

    // Panggil renderTasks pertama kali saat halaman dimuat
    renderTasks();
});