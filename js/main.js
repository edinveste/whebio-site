/**
 * WHEBIO SABINO — CONSULTOR IMOBILIÁRIO
 * Interatividade, Calculadora MCMV e Integrações
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSimulator();
  initFaqAccordion();
  initPropertyFilter();
  initSmoothScroll();
});

/* ==========================================================================
   1. Header & Mobile Menu
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.main-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    // Fecha ao clicar em um link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.innerHTML = '☰';
      });
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        toggleBtn.innerHTML = '☰';
      }
    });
  }
}

/* ==========================================================================
   2. Calculadora Interativa Minha Casa Minha Vida
   ========================================================================== */
function initSimulator() {
  const incomeRange = document.getElementById('income-range');
  const incomeDisplay = document.getElementById('income-val-display');
  const fgtsToggle = document.getElementById('toggle-fgts');
  const dependentsToggle = document.getElementById('toggle-dependents');

  const subsidyDisplay = document.getElementById('result-subsidy');
  const paymentDisplay = document.getElementById('result-payment');
  const bracketDisplay = document.getElementById('result-bracket');
  const simWhatsappBtn = document.getElementById('sim-whatsapp-cta');

  if (!incomeRange) return;

  function formatBRL(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  }

  function calculateMCMV() {
    const income = parseFloat(incomeRange.value);
    const hasFgts = fgtsToggle.classList.contains('active');
    const hasDependents = dependentsToggle.classList.contains('active');

    incomeDisplay.textContent = formatBRL(income);

    let bracket = 'Faixa 1';
    let maxSubsidy = 55000;
    let estimatedPayment = 480;

    if (income <= 2640) {
      bracket = 'Faixa 1 (Subsídio Máximo)';
      maxSubsidy = 55000;
      estimatedPayment = Math.max(380, Math.round(income * 0.22));
    } else if (income <= 4400) {
      bracket = 'Faixa 2 (Juros Reduzidos)';
      // Subsídio decrescente de 55k até ~20k
      const ratio = (4400 - income) / (4400 - 2640);
      maxSubsidy = Math.round(20000 + (35000 * ratio));
      estimatedPayment = Math.round(income * 0.26);
    } else if (income <= 8000) {
      bracket = 'Faixa 3 (Taxas Especiais)';
      maxSubsidy = 0; // Na faixa 3 o benefício é taxa reduzida de juros Caixa
      estimatedPayment = Math.round(income * 0.28);
    }

    if (hasDependents && maxSubsidy > 0) {
      maxSubsidy = Math.min(55000, maxSubsidy + 4000);
    }

    bracketDisplay.textContent = bracket;
    
    if (maxSubsidy > 0) {
      subsidyDisplay.textContent = 'Até ' + formatBRL(maxSubsidy);
      subsidyDisplay.classList.add('highlight');
    } else {
      subsidyDisplay.textContent = 'Taxa Reduzida Caixa';
      subsidyDisplay.classList.remove('highlight');
    }

    paymentDisplay.textContent = 'A partir de ' + formatBRL(estimatedPayment) + '/mês';

    // Monta o link personalizado para o WhatsApp
    const fgtsText = hasFgts ? 'Tenho FGTS para abater' : 'Não tenho FGTS';
    const depText = hasDependents ? 'Tenho dependente/composição' : 'Vou comprar sozinho(a)';
    const message = encodeURIComponent(
      `Olá Whebio! Fiz a simulação no seu site:\n` +
      `• Renda familiar: ${formatBRL(income)}\n` +
      `• ${fgtsText}\n` +
      `• ${depText}\n` +
      `• Estimativa: ${bracket}\n\n` +
      `Gostaria de ver as opções de apartamentos Vibra e saber como dar entrada!`
    );

    simWhatsappBtn.href = `https://wa.me/5511985769385?text=${message}`;
  }

  // Event Listeners
  incomeRange.addEventListener('input', calculateMCMV);

  fgtsToggle.addEventListener('click', () => {
    fgtsToggle.classList.toggle('active');
    calculateMCMV();
  });

  dependentsToggle.addEventListener('click', () => {
    dependentsToggle.classList.toggle('active');
    calculateMCMV();
  });

  // Executa uma vez no carregamento
  calculateMCMV();
}

/* ==========================================================================
   3. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fecha todos
      items.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      // Se não estava ativo, abre
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   4. Filtro de Empreendimentos
   ========================================================================== */
function initPropertyFilter() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const cards = document.querySelectorAll('.property-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. Smooth Scroll
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
