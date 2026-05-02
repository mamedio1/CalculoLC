
        // ==================== SCRIPT DO BACKGROUND (Mantido inalterado) ====================
        const canvas = document.getElementById('bg');
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const COLS = 28;
        const ROWS = 18;
        let t = 0;

        function lerp(a, b, x) { return a + (b - a) * x; }

        function drawGrid() {
            const W = canvas.width;
            const H = canvas.height;
            const cw = W / COLS;
            const ch = H / ROWS;
  
            ctx.clearRect(0, 0, W, H);

            for (let r = 0; r <= ROWS; r++) {
                for (let c = 0; c <= COLS; c++) {
                    const x = c * cw;
                    const y = r * ch;
                    const dx = (c / COLS - 0.5);
                    const dy = (r / ROWS - 0.5);
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const wave = Math.sin(dist * 6 - t * 0.8) * 0.5 + 0.5;
                    const alpha = lerp(0.04, 0.22, wave) * lerp(1, 0.3, dist * 1.4);

                    if (c < COLS && r < ROWS) {
                        const wave2 = Math.sin(dx * 5 + t * 0.5) * Math.cos(dy * 5 - t * 0.4);
                        const gAlpha = lerp(0.0, 0.08, (wave2 + 1) * 0.5) * lerp(1, 0.1, dist * 2);
                        ctx.fillStyle = `rgba(124, 58, 237, ${gAlpha})`;
                        ctx.fillRect(x, y, cw, ch);
                    }

                    ctx.beginPath();
                    ctx.arc(x, y, 1.2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(180, 140, 255, ${alpha})`;
                    ctx.fill();

                    if (c < COLS) {
                        const nx = (c + 1) * cw;
                        const ny = y;
                        const wa = Math.sin((c / COLS) * 4 + (r / ROWS) * 3 - t * 0.6) * 0.5 + 0.5;
                        const la = lerp(0.03, 0.14, wa) * lerp(1, 0.2, dist * 1.6);
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(nx, ny);
                        ctx.strokeStyle = `rgba(100, 80, 200, ${la})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                    if (r < ROWS) {
                        const nx = x;
                        const ny = (r + 1) * ch;
                        const wa = Math.sin((r / ROWS) * 4 + (c / COLS) * 3 + t * 0.55) * 0.5 + 0.5;
                        const la = lerp(0.03, 0.14, wa) * lerp(1, 0.2, dist * 1.6);
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(nx, ny);
                        ctx.strokeStyle = `rgba(100, 80, 200, ${la})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            for (let i = 0; i < 4; i++) {
                const px = Math.sin(t * 0.3 + i * 1.8) * 0.35 + 0.5;
                const py = Math.cos(t * 0.25 + i * 2.1) * 0.35 + 0.5;
                const gx = px * W;
                const gy = py * H;
                const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, W * 0.25);
                grad.addColorStop(0, `rgba(124,58,237,0.07)`);
                grad.addColorStop(1, `rgba(124,58,237,0)`);
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, W, H);
            }

            t += 0.016;
            requestAnimationFrame(drawGrid);
        }
        drawGrid();

        // ==================== FUNÇÃO DA CALCULADORA LC (Atualizada) ====================
        function calcularFrequencia() {
            // Obtém os valores numéricos e as unidades selecionadas
            const C_raw = parseFloat(document.getElementById('capacitanciaValue').value);
            const C_unit_multiplier = parseFloat(document.getElementById('capacitanciaUnidade').value);

            const L_raw = parseFloat(document.getElementById('indutanciaValue').value);
            const L_unit_multiplier = parseFloat(document.getElementById('indutanciaUnidade').value);

            const resultadoEl = document.getElementById('resultado');

            // Validação dos valores brutos
            if (isNaN(C_raw) || isNaN(L_raw) || C_raw <= 0 || L_raw <= 0) {
                resultadoEl.innerHTML = `<span style="color:#f87171;">Por favor, insira valores numéricos positivos.</span>`;
                return;
            }

            // Converte os valores para a unidade base (Farads e Henrys)
            const C = C_raw * C_unit_multiplier;
            const L = L_raw * L_unit_multiplier;

            // Cálculo da frequência de ressonância
            // f = 1 / (2 * π * sqrt(L * C))
            const fHz = 1 / (2 * Math.PI * Math.sqrt(L * C));

            // Formata o resultado para exibição amigável (Hz, kHz, MHz, GHz)
            let texto;
            let precisao;

            if (fHz >= 1e9) { // GHz
                precisao = (fHz >= 100e9) ? 0 : (fHz >= 10e9 ? 1 : 2); // Ex: 100GHz, 10.0GHz, 1.00GHz
                texto = `${(fHz / 1e9).toFixed(precisao)} GHz`;
            } else if (fHz >= 1e6) { // MHz
                precisao = (fHz >= 100e6) ? 0 : (fHz >= 10e6 ? 1 : 2); // Ex: 100MHz, 10.0MHz, 1.00MHz
                texto = `${(fHz / 1e6).toFixed(precisao)} MHz`;
            } else if (fHz >= 1e3) { // kHz
                precisao = (fHz >= 100e3) ? 0 : (fHz >= 10e3 ? 1 : 2); // Ex: 100kHz, 10.0kHz, 1.00kHz
                texto = `${(fHz / 1e3).toFixed(precisao)} kHz`;
            } else { // Hz
                precisao = (fHz >= 100) ? 0 : (fHz >= 10 ? 1 : 2); // Ex: 100Hz, 10.0Hz, 1.00Hz
                texto = `${fHz.toFixed(precisao)} Hz`;
            }

            resultadoEl.innerHTML = `Frequência: <strong>${texto}</strong>`;
        }

        // ==================== FUNÇÃO CÁLCULO DE ESPIRAS ====================
        function calcularEspiras() {
            const L_raw = parseFloat(document.getElementById('indutanciaBobina').value);
            const L_mult = parseFloat(document.getElementById('indutanciaBobinaUnidade').value);

            const l_raw = parseFloat(document.getElementById('comprimentoBobina').value);
            const l_mult = parseFloat(document.getElementById('comprimentoBobinaUnidade').value);

            const r_raw = parseFloat(document.getElementById('raioBobina').value);
            const r_mult = parseFloat(document.getElementById('raioBobinaUnidade').value);

            const resultadoEl = document.getElementById('resultadoEspiras');

            // Validação
            if (isNaN(L_raw) || isNaN(l_raw) || isNaN(r_raw) || L_raw <= 0 || l_raw <= 0 || r_raw <= 0) {
                resultadoEl.innerHTML = `<span style="color:#f87171;">Preencha os 3 campos.</span>`;
                return;
            }

            // Converte tudo para unidades base (Henrys e Metros)
            const L = L_raw * L_mult;
            const l = l_raw * l_mult;
            const r = r_raw * r_mult;

            // Constante física: Permeabilidade magnética do vácuo (4 * pi * 10^-7)
            const mu0 = 4 * Math.PI * 1e-7;

            // Área da seção transversal (A = pi * r^2)
            const A = Math.PI * Math.pow(r, 2);

            // Fórmula Solenoide Núcleo de Ar: N = sqrt( (L * l) / (mu0 * A) )
            const N = Math.sqrt((L * l) / (mu0 * A));

            // Arredondamos para o número inteiro mais próximo, pois não existe "meia espira" na prática
            const N_inteiro = Math.round(N);

            resultadoEl.innerHTML = `<span style="color:#06b6d4; font-weight:600;">Espiras:</span> <strong style="color:#4ade80; font-size: 24px;">${N_inteiro}</strong> <span style="font-size: 12px; opacity: 0.7; color:#a5b4fc;">(Exato: ${N.toFixed(1)})</span>`;
        }
        // ==================== FUNÇÃO ANTENA DIPOLO ====================
        function calcularDipolo() {
            const fRaw = parseFloat(document.getElementById('freqDipolo').value);
            const fMult = parseFloat(document.getElementById('freqDipoloUnidade').value);
            const resEl = document.getElementById('resultadoDipolo');

            if (isNaN(fRaw) || fRaw <= 0) {
                resEl.innerHTML = `<span style="color:#f87171;">Insira uma frequência válida.</span>`;
                return;
            }

            // Converte a frequência para MHz (que é o padrão das fórmulas de antena)
            const fMHz = fRaw * fMult;

            // Fórmula prática (já considera o fator de velocidade do fio ~0.95): 142.5 / f
            const L_total = 142.5 / fMHz;
            const L_perna = L_total / 2;

            resEl.innerHTML = `
                <span style="color:#06b6d4; font-weight:600; display:block; margin-bottom:8px;">Comprimentos:</span>
                <span style="color:#a5b4fc; font-size: 14px;">Total:</span> <strong style="color:#4ade80; font-size: 18px;">${L_total.toFixed(2)} m</strong><br>
                <span style="color:#a5b4fc; font-size: 14px;">Pernas:</span> <strong style="color:#4ade80; font-size: 18px;">${L_perna.toFixed(2)} m</strong>
                <span style="display:block; font-size:11px; color:#7c3aed; margin-top:8px;">(Fórmula prática: 142.5 / f)</span>
            `;
        }

        // ==================== FUNÇÃO ANTENA PLANO TERRA ====================
        function calcularGroundPlane() {
            const fRaw = parseFloat(document.getElementById('freqGround').value);
            const fMult = parseFloat(document.getElementById('freqGroundUnidade').value);
            const resEl = document.getElementById('resultadoGround');

            if (isNaN(fRaw) || fRaw <= 0) {
                resEl.innerHTML = `<span style="color:#f87171;">Insira uma frequência válida.</span>`;
                return;
            }

            const fMHz = fRaw * fMult;

            // Elemento Radiante (Vertical): 71.5 / f
            const L_radiante = 71.5 / fMHz;
            // Radiais Horizontais (0 graus): mesmo comprimento do radiante
            const L_radial_horiz = 71.5 / fMHz;
            // Radiais Inclinados (45 graus): geralmente 5% mais longos para ajuste de impedância (50 ohms)
            const L_radial_45 = L_radial_horiz * 1.05;

            resEl.innerHTML = `
                <span style="color:#06b6d4; font-weight:600; display:block; margin-bottom:8px;">Comprimentos:</span>
                <span style="color:#a5b4fc; font-size: 14px;">Vertical:</span> <strong style="color:#4ade80; font-size: 18px;">${L_radiante.toFixed(2)} m</strong><br>
                <span style="color:#a5b4fc; font-size: 14px;">Radiais (0°):</span> <strong style="color:#4ade80; font-size: 18px;">${L_radial_horiz.toFixed(2)} m</strong><br>
                <span style="color:#a5b4fc; font-size: 14px;">Radiais (45°):</span> <strong style="color:#4ade80; font-size: 18px;">${L_radial_45.toFixed(2)} m</strong>
                <span style="display:block; font-size:11px; color:#7c3aed; margin-top:8px;">(Fórmula prática: 71.5 / f)</span>
            `;
        }

