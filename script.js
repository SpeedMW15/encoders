document.addEventListener('DOMContentLoaded', () => {
    // Canvases
    const diskCanvas = document.getElementById('diskCanvas');
    const diskCtx = diskCanvas.getContext('2d');
    
    const waveCanvas = document.getElementById('waveCanvas');
    const waveCtx = waveCanvas.getContext('2d');

    // Controls
    const btnPlay = document.getElementById('btnPlay');
    const btnDir = document.getElementById('btnDir');
    const speedSlider = document.getElementById('speedSlider');
    const dirText = document.getElementById('dirText');
    const pulseCountEl = document.getElementById('pulseCount');

    // State
    let isRunning = false;
    let angle = 0;
    let speed = parseInt(speedSlider.value);
    let direction = 1; // 1 = CW, -1 = CCW
    let pulses = 0;
    let animationFrame;

    const totalSlots = 12;

    // Actualizar velocidad
    speedSlider.addEventListener('input', (e) => {
        speed = parseInt(e.target.value);
    });

    // Play/Pause
    btnPlay.addEventListener('click', () => {
        isRunning = !isRunning;
        btnPlay.innerHTML = isRunning 
            ? '<i data-lucide="pause" class="w-4 h-4"></i> Pausar'
            : '<i data-lucide="play" class="w-4 h-4"></i> Iniciar';
        lucide.createIcons();
        if (isRunning) animate();
    });

    // Direccion
    btnDir.addEventListener('click', () => {
        direction *= -1;
        dirText.textContent = direction === 1 ? 'Horario (CW)' : 'Antihorario (CCW)';
    });

    function drawDisk() {
        const cx = diskCanvas.width / 2;
        const cy = diskCanvas.height / 2;
        const radius = 80;

        diskCtx.clearRect(0, 0, diskCanvas.width, diskCanvas.height);

        // Disco Base
        diskCtx.save();
        diskCtx.translate(cx, cy);
        diskCtx.rotate(angle);

        diskCtx.beginPath();
        diskCtx.arc(0, 0, radius, 0, Math.PI * 2);
        diskCtx.fillStyle = '#0f172a';
        diskCtx.fill();
        diskCtx.strokeStyle = '#334155';
        diskCtx.lineWidth = 3;
        diskCtx.stroke();

        // Ranuras
        for (let i = 0; i < totalSlots; i++) {
            const slotAngle = (i * 2 * Math.PI) / totalSlots;
            diskCtx.beginPath();
            diskCtx.moveTo(0, 0);
            diskCtx.arc(0, 0, radius - 5, slotAngle, slotAngle + (Math.PI / totalSlots));
            diskCtx.fillStyle = '#06b6d4';
            diskCtx.fill();
        }

        // Centro
        diskCtx.beginPath();
        diskCtx.arc(0, 0, 25, 0, Math.PI * 2);
        diskCtx.fillStyle = '#1e293b';
        diskCtx.fill();
        diskCtx.stroke();

        diskCtx.restore();
    }

    function drawWaves() {
        waveCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
        
        const width = waveCanvas.width;
        const hA = 30; // Canal A base Y
        const hB = 80; // Canal B base Y
        const amp = 20;

        waveCtx.lineWidth = 2;

        // Canal A
        waveCtx.strokeStyle = '#22d3ee';
        waveCtx.beginPath();
        for (let x = 0; x < width; x++) {
            const val = Math.sin((x + angle * 50) * 0.05) > 0 ? 1 : 0;
            const y = hA - val * amp;
            if (x === 0) waveCtx.moveTo(x, y);
            else waveCtx.lineTo(x, y);
        }
        waveCtx.stroke();

        // Canal B (Desfasado)
        const shift = direction === 1 ? Math.PI / 2 : -Math.PI / 2;
        waveCtx.strokeStyle = '#60a5fa';
        waveCtx.beginPath();
        for (let x = 0; x < width; x++) {
            const val = Math.sin((x + angle * 50) * 0.05 + shift) > 0 ? 1 : 0;
            const y = hB - val * amp;
            if (x === 0) waveCtx.moveTo(x, y);
            else waveCtx.lineTo(x, y);
        }
        waveCtx.stroke();
    }

    function animate() {
        if (!isRunning) return;

        angle += 0.01 * speed * direction;
        pulses += Math.round(speed * 0.5);
        pulseCountEl.textContent = pulses;

        drawDisk();
        drawWaves();

        animationFrame = requestAnimationFrame(animate);
    }

    // Dibujo inicial
    drawDisk();
    drawWaves();
});