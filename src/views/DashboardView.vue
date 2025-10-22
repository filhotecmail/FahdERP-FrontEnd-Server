<template>
  <div class="dashboard-container">
    <!-- Navbar Superior -->
    <nav class="top-navbar">
      <div class="navbar-left">
        <button @click="toggleSidebar" class="hamburger-btn" title="Abrir/fechar menu lateral">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="brand-container">
          <div class="brand-logo">
            <svg viewBox="0 0 40 40" class="logo-icon">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#00ff7f;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#00cc66;stop-opacity:1" />
                </linearGradient>
              </defs>
              <!-- Círculo externo -->
              <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" opacity="0.1" stroke="url(#logoGradient)" stroke-width="2"/>
              <!-- Forma central moderna -->
              <path d="M12 8 L28 8 C30 8 32 10 32 12 L32 20 C32 22 30 24 28 24 L20 24 L20 28 C20 30 18 32 16 32 L12 32 C10 32 8 30 8 28 L8 12 C8 10 10 8 12 8 Z" fill="url(#logoGradient)"/>
              <!-- Detalhes internos -->
              <rect x="12" y="12" width="8" height="2" fill="white" opacity="0.8" rx="1"/>
              <rect x="12" y="16" width="12" height="2" fill="white" opacity="0.6" rx="1"/>
              <rect x="12" y="20" width="6" height="2" fill="white" opacity="0.4" rx="1"/>
            </svg>
          </div>
          <h1 class="brand-title">Fahd ERP</h1>
        </div>
      </div>

      <div class="navbar-center">
        <div class="search-box">
          <input type="text" placeholder="Buscar..." v-model="searchQuery">
          <button class="search-btn" title="Buscar">
            <svg viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="navbar-right">
        <WeatherWidget />
        <ThemeSelector />
        <UserDropdown />
        <LogoutDropdown />
      </div>
    </nav>

    <!-- Barra de Abas -->
    <div class="tabs-bar" v-if="tabCache.tabs.value.length > 0">
      <div class="tabs-container">
        <div
          v-for="(tab, index) in tabCache.tabs.value"
          :key="tab.id"
          class="tab-item"
          :class="{
            active: tabCache.activeTabId.value === tab.id,
            dragging: draggedTab === tab.id,
            'drag-over': dragOverIndex === index
          }"
          :draggable="activeTabMenu !== tab.id"
          @click="switchTab(tab.id)"
          @dragstart="activeTabMenu === tab.id ? $event.preventDefault() : handleDragStart(tab.id, $event)"
          @dragover="handleDragOver($event)"
          @drop="handleDrop(index, $event)"
          @dragend="handleDragEnd"
          @dragenter="handleDragEnter(index)"
          @dragleave="handleDragLeave"
        >
          <span class="tab-title">{{ tab.title }}</span>
          <div class="tab-actions">
            <!-- Menu Dropdown -->
            <div class="tab-menu-container" v-if="tab.closable" @dragstart.stop.prevent @mousedown.stop>
              <button
                @click.stop="toggleTabMenu(tab.id, $event)"
                @mousedown.stop
                @dragstart.stop.prevent
                class="tab-menu-btn"
                title="Opções da aba"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/>
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="activeTabMenu === tab.id"
                class="tab-dropdown-menu"
                @click.stop
              >
                <button
                  @click="closeTabFromMenu(tab.id)"
                  class="tab-dropdown-item"
                >
                  <svg viewBox="0 0 24 24" class="dropdown-icon">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                  </svg>
                  Fechar aba
                </button>
              </div>
            </div>

            <!-- Botão de fechar tradicional (mantido como fallback) -->
            <button
              v-if="tab.closable"
              @click.stop="closeTab(tab.id)"
              class="tab-close-btn"
              title="Fechar aba"
              style="display: none;"
            >
              <svg viewBox="0 0 24 24">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Layout Principal -->
    <div class="main-layout">
      <!-- Sidebar -->
      <aside class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
        <div class="sidebar-content">
          <div class="sidebar-header">
            <h3 title="Lista de módulos disponíveis">Módulos ERP</h3>
          </div>

          <nav class="sidebar-nav">
            <!-- Dashboard -->
            <div class="nav-item" :class="{ active: activeModule === 'dashboard' }" @click="setActiveModule('dashboard')">
              <svg class="nav-icon" viewBox="0 0 24 24">
                <path d="M3,13H11V3H3M3,21H11V15H3M13,21H21V11H13M13,3V9H21V3"/>
              </svg>
              <span>Dashboard</span>
            </div>

            <!-- Módulo Vendas/CRM -->
            <div class="nav-group">
              <div class="nav-item group-header" @click="toggleGroup('vendas')" title="Módulo de Vendas & CRM">
                <svg class="nav-icon" viewBox="0 0 24 24">
                  <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
                </svg>
                <span>Vendas & CRM</span>
                <svg class="expand-icon" :class="{ expanded: expandedGroups.vendas }" viewBox="0 0 24 24">
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                </svg>
              </div>
              <div class="nav-submenu" v-show="expandedGroups.vendas">
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('dashboard-vendas')" title="Dashboard de vendas e métricas">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M3,13H11V3H3M3,21H11V15H3M13,21H21V11H13M13,3V9H21V3"/>
                  </svg>
                  <span>Dashboard Vendas</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('vendas')" title="Gerenciar pedidos de venda">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M19,7H18V6A2,2 0 0,0 16,4H8A2,2 0 0,0 6,6V7H5A3,3 0 0,0 2,10V19A3,3 0 0,0 5,22H19A3,3 0 0,0 22,19V10A3,3 0 0,0 19,7M8,6H16V7H8V6Z"/>
                  </svg>
                  <span>Pedidos de Venda</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('clientes')" title="Cadastro e gestão de clientes">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                  </svg>
                  <span>Cadastro de Clientes</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('propostas')" title="Criar e gerenciar propostas comerciais">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                  <span>Propostas Comerciais</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('comissoes')" title="Controle de comissões de vendas">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M5,6H23V18H5V6M14,9A3,3 0 0,1 17,12A3,3 0 0,1 14,15A3,3 0 0,1 11,12A3,3 0 0,1 14,9M9,8A2,2 0 0,1 7,10V14A2,2 0 0,1 9,16H19A2,2 0 0,1 21,14V10A2,2 0 0,1 19,8H9Z"/>
                  </svg>
                  <span>Comissões</span>
                </div>
              </div>
            </div>

            <!-- Módulo Estoque -->
            <div class="nav-group">
              <div class="nav-item group-header" @click="toggleGroup('estoque')" title="Módulo de Estoque">
                <svg class="nav-icon" viewBox="0 0 24 24">
                  <path d="M12,2L2,7L12,12L22,7L12,2M2,17L12,22L22,17M2,12L12,17L22,12"/>
                </svg>
                <span>Estoque</span>
                <svg class="expand-icon" :class="{ expanded: expandedGroups.estoque }" viewBox="0 0 24 24">
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                </svg>
              </div>
              <div class="nav-submenu" v-show="expandedGroups.estoque">
                <div class="nav-subitem" @click="setActiveModule('produtos')" title="Cadastro e gestão de produtos">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,12.19 18.45,13.27 17.59,14L16.5,15.08C16.5,15.08 16.5,15.08 16.5,15.09L16.5,16.5C16.5,17.88 15.38,19 14,19H10C8.62,19 7.5,17.88 7.5,16.5L7.5,15.09C7.5,15.08 7.5,15.08 7.5,15.08L6.41,14C5.55,13.27 5,12.19 5,11A7,7 0 0,1 12,4A7,7 0 0,1 19,11Z"/>
                  </svg>
                  <span>Cadastro de Produtos</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('compras')" title="Gerenciar compras e pedidos">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M17,18C17.56,18 18,18.44 18,19A1,1 0 0,1 17,20H7A1,1 0 0,1 6,19C6,18.44 6.44,18 7,18H17M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5H5.21L4.27,3H1Z"/>
                  </svg>
                  <span>Compras</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('fornecedores')" title="Cadastro de fornecedores">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M21,9V20H3V9L6,6H18L21,9M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z"/>
                  </svg>
                  <span>Fornecedores</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('inventario')">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M9,11H15L13.5,7.5L9,11M12,2L13.09,8.26L22,9L14,14L17,23L12,18L7,23L10,14L2,9L10.91,8.26L12,2Z"/>
                  </svg>
                  <span>Inventário</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('almoxarifado')">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M4,6V18H11V6H4M20,18V6H13V18H20Z"/>
                  </svg>
                  <span>Almoxarifado</span>
                </div>
              </div>
            </div>

            <!-- Módulo Financeiro -->
            <div class="nav-group">
              <div class="nav-item group-header" @click="toggleGroup('financeiro')" title="Módulo Financeiro">
                <svg class="nav-icon" viewBox="0 0 24 24">
                  <path d="M11.8,10.9C9.53,10.31 8.8,9.7 8.8,8.75C8.8,7.66 9.81,6.9 11.5,6.9C13.28,6.9 13.94,7.75 14,9H16.21C16.14,7.28 15.09,5.7 13,5.19V3H10V5.16C8.06,5.58 6.5,6.84 6.5,8.77C6.5,11.08 8.41,12.23 11.2,12.9C13.7,13.5 14.2,14.38 14.2,15.31C14.2,16 13.71,17.1 11.5,17.1C9.44,17.1 8.63,16.18 8.5,15H6.32C6.44,17.19 8.08,18.42 10,18.83V21H13V18.85C14.95,18.5 16.5,17.35 16.5,15.3C16.5,12.46 14.07,11.5 11.8,10.9Z"/>
                </svg>
                <span>Financeiro</span>
                <svg class="expand-icon" :class="{ expanded: expandedGroups.financeiro }" viewBox="0 0 24 24">
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                </svg>
              </div>
              <div class="nav-submenu" v-show="expandedGroups.financeiro">
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('contas-receber')" title="Gerenciar contas a receber">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M2,6H22V18H2V6M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M7,8A2,2 0 0,1 5,10V14A2,2 0 0,1 7,16H17A2,2 0 0,1 19,14V10A2,2 0 0,1 17,8H7Z"/>
                  </svg>
                  <span>Contas a Receber</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('contas-pagar')" title="Gerenciar contas a pagar">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M11,17H4A2,2 0 0,1 2,15V3A2,2 0 0,1 4,1H20A2,2 0 0,1 22,3V6H20V3H4V15H11V17M16,10V7L21,12L16,17V14H8V10H16Z"/>
                  </svg>
                  <span>Contas a Pagar</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('fluxo-caixa')" title="Controle de fluxo de caixa">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M3,3V21H21V19H5V3H3M9,17H7V10H9V17M13,17H11V7H13V17M17,17H15V13H17V17Z"/>
                  </svg>
                  <span>Fluxo de Caixa</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('bancos')" title="Conciliação bancária">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M11.5,1L2,6V8H21V6M16,10V17H19V19H5V17H8V10H10V17H14V10M2,20V22H21V20"/>
                  </svg>
                  <span>Conciliação Bancária</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('dre')" title="Demonstrativo de Resultado do Exercício">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                  <span>DRE</span>
                </div>
              </div>
            </div>

            <!-- Módulo Fiscal -->
            <div class="nav-group">
              <div class="nav-item group-header" @click="toggleGroup('fiscal')" title="Módulo Fiscal">
                <svg class="nav-icon" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                <span>Fiscal</span>
                <svg class="expand-icon" :class="{ expanded: expandedGroups.fiscal }" viewBox="0 0 24 24">
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                </svg>
              </div>
              <div class="nav-submenu" v-show="expandedGroups.fiscal">
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('nfe')" title="Emissão de Nota Fiscal Eletrônica">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                  <span>Nota Fiscal Eletrônica</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('nfce')" title="Nota Fiscal de Consumidor Eletrônica">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z"/>
                  </svg>
                  <span>NFC-e</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('sped')" title="Sistema Público de Escrituração Digital">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6M6,4H13V9H18V20H6V4Z"/>
                  </svg>
                  <span>SPED Fiscal</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('impostos')" title="Apuração e controle de impostos">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
                  </svg>
                  <span>Apuração de Impostos</span>
                </div>
              </div>
            </div>

            <!-- Módulo RH -->
            <div class="nav-group">
              <div class="nav-item group-header" @click="toggleGroup('rh')" title="Módulo de Recursos Humanos">
                <svg class="nav-icon" viewBox="0 0 24 24">
                  <path d="M16,4C18.21,4 20,5.79 20,8C20,10.21 18.21,12 16,12C13.79,12 12,10.21 12,8C12,5.79 13.79,4 16,4M16,14C18.67,14 24,15.33 24,18V20H8V18C8,15.33 13.33,14 16,14M8,4C10.21,4 12,5.79 12,8C12,10.21 10.21,12 8,12C5.79,12 4,10.21 4,8C4,5.79 5.79,4 8,4M8,14C10.67,14 16,15.33 16,18V20H0V18C0,15.33 5.33,14 8,14Z"/>
                </svg>
                <span>Recursos Humanos</span>
                <svg class="expand-icon" :class="{ expanded: expandedGroups.rh }" viewBox="0 0 24 24">
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                </svg>
              </div>
              <div class="nav-submenu" v-show="expandedGroups.rh">
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('funcionarios')" title="Cadastro e gestão de funcionários">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                  </svg>
                  <span>Cadastro de Funcionários</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('folha-pagamento')" title="Processamento da folha de pagamento">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M5,6H23V18H5V6M14,9A3,3 0 0,1 17,12A3,3 0 0,1 14,15A3,3 0 0,1 11,12A3,3 0 0,1 14,9M9,8A2,2 0 0,1 7,10V14A2,2 0 0,1 9,16H19A2,2 0 0,1 21,14V10A2,2 0 0,1 19,8H9Z"/>
                  </svg>
                  <span>Folha de Pagamento</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('ponto')" title="Controle de ponto eletrônico">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                  </svg>
                  <span>Controle de Ponto</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('ferias')" title="Gestão de férias e licenças">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V8H19V19M19,6H5V5H19V6Z"/>
                  </svg>
                  <span>Férias e Licenças</span>
                </div>
                <div class="nav-subitem group-header" @click="toggleGroup('esocial')" title="Integração com eSocial">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M17,12C17,14.42 15.28,16.44 13,16.9V21H11V16.9C8.72,16.44 7,14.42 7,12C7,9.58 8.72,7.56 11,7.1V2H13V7.1C15.28,7.56 17,9.58 17,12M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"/>
                  </svg>
                  <span>eSocial</span>
                  <svg class="expand-icon" :class="{ expanded: expandedGroups.esocial }" viewBox="0 0 24 24">
                    <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                  </svg>
                </div>
                <div class="nav-submenu" v-show="expandedGroups.esocial">
                  <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('esocial-s1000')" title="S-1000 - Informações do Empregador">
                    <svg class="nav-subicon" viewBox="0 0 24 24">
                      <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                    </svg>
                    <span>S-1000 - Empregador</span>
                  </div>

                  <!-- Processamento da informação -->
                  <div class="nav-subitem group-header" @click="toggleGroup('esocial-processing')" title="Processamento da informação">
                    <svg class="nav-subicon" viewBox="0 0 24 24">
                      <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
                    </svg>
                    <span>Processamento da informação</span>
                    <svg class="expand-icon" :class="{ expanded: expandedGroups['esocial-processing'] }" viewBox="0 0 24 24">
                      <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                    </svg>
                  </div>
                  <div class="nav-submenu" v-show="expandedGroups['esocial-processing']">
                    <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('esocial-processing')" title="eSocial - Processamento e Envio">
                      <svg class="nav-subicon" viewBox="0 0 24 24">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
                      </svg>
                      <span>Processamento e Envio</span>
                    </div>
                  </div>

                  <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('esocial-s2200')" title="S-2200 - Cadastramento Inicial do Vínculo e Admissão de Trabalhador">
                    <svg class="nav-subicon" viewBox="0 0 24 24">
                      <path d="M16,4C18.21,4 20,5.79 20,8C20,10.21 18.21,12 16,12C13.79,12 12,10.21 12,8C12,5.79 13.79,4 16,4M16,14C18.67,14 24,15.33 24,18V20H8V18C8,15.33 13.33,14 16,14M8,4C10.21,4 12,5.79 12,8C12,10.21 10.21,12 8,12C5.79,12 4,10.21 4,8C4,5.79 5.79,4 8,4M8,14C10.67,14 16,15.33 16,18V20H0V18C0,15.33 5.33,14 8,14Z"/>
                    </svg>
                    <span>S-2200 - Admissão</span>
                  </div>
                  <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('esocial-eventos')" title="Consultar Eventos eSocial">
                    <svg class="nav-subicon" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                    <span>Consultar Eventos</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Módulo Indústria -->
            <div class="nav-group">
              <div class="nav-item group-header" @click="toggleGroup('industria')" title="Módulo Industrial">
                <svg class="nav-icon" viewBox="0 0 24 24">
                  <path d="M17,7H22V17H17V19A1,1 0 0,0 18,20H20V22H16C14.89,22 14,21.1 14,20V19H8V20C8,21.1 7.11,22 6,22H2V20H4A1,1 0 0,0 5,19V5A1,1 0 0,0 4,4H2V2H6C7.11,2 8,2.9 8,4V5H14V4C14,2.9 14.89,2 16,2H20V4H18A1,1 0 0,0 17,5V7M9,6V18H15V6H9Z"/>
                </svg>
                <span>Indústria</span>
                <svg class="expand-icon" :class="{ expanded: expandedGroups.industria }" viewBox="0 0 24 24">
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                </svg>
              </div>
              <div class="nav-submenu" v-show="expandedGroups.industria">
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('producao')" title="Controle de ordens de produção">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M17,7H22V17H17V19A1,1 0 0,0 18,20H20V22H16C14.89,22 14,21.1 14,20V19H8V20C8,21.1 7.11,22 6,22H2V20H4A1,1 0 0,0 5,19V5A1,1 0 0,0 4,4H2V2H6C7.11,2 8,2.9 8,4V5H14V4C14,2.9 14.89,2 16,2H20V4H18A1,1 0 0,0 17,5V7M9,6V18H15V6H9Z"/>
                  </svg>
                  <span>Ordens de Produção</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('bom')" title="Lista de materiais e estrutura de produtos">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M3,5H9V11H3V5M5,7V9H7V7H5M11,7H21V9H11V7M11,15H21V17H11V15M5,20L1.5,16.5L2.91,15.09L5,17.17L9.59,12.59L11,14L5,20Z"/>
                  </svg>
                  <span>Lista de Materiais (BOM)</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('qualidade')" title="Controle de qualidade e inspeções">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
                  </svg>
                  <span>Controle de Qualidade</span>
                </div>
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('manutencao')" title="Manutenção preventiva e corretiva">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M22.7,19L13.6,9.9C14.5,7.6 14,4.9 12.1,3C10.1,1 7.1,0.6 4.7,1.7L9,6L6,9L1.6,4.7C0.4,7.1 0.9,10.1 2.9,12.1C4.8,14 7.5,14.5 9.8,13.6L18.9,22.7C19.3,23.1 19.9,23.1 20.3,22.7L22.6,20.4C23.1,20 23.1,19.3 22.7,19Z"/>
                  </svg>
                  <span>Manutenção</span>
                </div>
              </div>
            </div>

            <!-- Módulo Usuários -->
            <div class="nav-group">
              <div class="nav-item group-header" @click="toggleGroup('usuarios')" title="Módulo de Usuários">
                <svg class="nav-icon" viewBox="0 0 24 24">
                  <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"/>
                </svg>
                <span>Usuários</span>
                <svg class="expand-icon" :class="{ expanded: expandedGroups.usuarios }" viewBox="0 0 24 24">
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                </svg>
              </div>
              <div class="nav-submenu" v-show="expandedGroups.usuarios">
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('gerenciamento-usuarios')" title="Gerenciar usuários do sistema">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                  </svg>
                  <span>Gerenciamento de Usuários</span>
                </div>
              </div>
            </div>

            <!-- Módulo Templates -->
            <div class="nav-group">
              <div class="nav-item group-header" @click="toggleGroup('templates')" title="Módulo de Templates">
                <svg class="nav-icon" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                <span>Templates</span>
                <svg class="expand-icon" :class="{ expanded: expandedGroups.templates }" viewBox="0 0 24 24">
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                </svg>
              </div>
              <div class="nav-submenu" v-show="expandedGroups.templates">
                <div class="nav-subitem" @click="expandSidebarIfNeeded(); setActiveModule('gerenciamento-template')" title="Gerenciar templates do sistema">
                  <svg class="nav-subicon" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                  <span>Gerenciamento de Templates</span>
                </div>
              </div>
            </div>

          </nav>
        </div>
      </aside>

      <!-- Conteúdo Principal -->
      <main class="main-content">
          <!-- Conteúdo da Aba Ativa com Cache -->
          <div class="module-content" v-if="tabCache.tabs.value.length > 0">
            <component
              :is="tabCache.activeTabComponent.value"
              v-if="tabCache.activeTabComponent.value"
            />

            <!-- Placeholder para módulos não implementados -->
            <div v-else-if="tabCache.activeTab.value">
              <div class="module-header">
                <h2>{{ tabCache.activeTab.value.title }}</h2>
              </div>
              <div class="module-placeholder" title="Módulo em fase de desenvolvimento">
                <div class="placeholder-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                  </svg>
                </div>
                <h3 title="Status do módulo">Módulo em Desenvolvimento</h3>
                <p title="Informação sobre disponibilidade">Este módulo está sendo desenvolvido e estará disponível em breve.</p>
              </div>
            </div>
          </div>

          <!-- Estado inicial - sem abas abertas -->
          <div class="welcome-state" v-else>
            <div class="welcome-content">
              <div class="welcome-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
                </svg>
              </div>
              <h2>Bem-vindo ao Sistema ERP</h2>
              <p>Selecione um módulo no menu lateral para começar a trabalhar.</p>
              <div class="welcome-tips">
                <h3>Dicas:</h3>
                <ul>
                  <li>Use o menu lateral para navegar entre os módulos</li>
                  <li>As abas permitem trabalhar com múltiplos módulos simultaneamente</li>
                  <li>Clique no ícone ✕ para fechar abas desnecessárias</li>
                </ul>
              </div>
            </div>
          </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, provide } from 'vue'
import { type RouteRecordRaw } from 'vue-router'
import ThemeSelector from '@/components/ThemeSelector.vue'
import WeatherWidget from '@/components/WeatherWidget.vue'
import UserDropdown from '@/components/UserDropdown.vue'
import LogoutDropdown from '@/components/LogoutDropdown.vue'
import DashboardComponent from '@/components/DashboardComponent.vue' // Componente removido
import { useThemeStore } from '@/stores/theme'
import { useTabCache } from '@/composables/useTabCache'
import { moduleSystem } from '@/modules/core/moduleSystem'

// const router = useRouter() // Removido pois não está sendo usado
const themeStore = useThemeStore()

// Estados da interface
const sidebarOpen = ref(false)
const activeModule = ref<string | null>(null)
const searchQuery = ref('')
const activeTabMenu = ref<string | null>(null)

// Estados do drag and drop
const draggedTab = ref<string | null>(null)
const dragOverIndex = ref<number | null>(null)

// Sistema de abas com cache
const tabCache = useTabCache({
  maxTabs: 8,
  enableCache: true,
  persistTabs: true,
  autoCloseInactive: false
})

// Remover listener duplicado - será tratado no onMounted principal

// Prover o tabCache para componentes filhos
provide('tabCache', tabCache)

// Registrar componentes das abas
tabCache.registerTabComponent('dashboard', DashboardComponent)
tabCache.registerTabComponent('dashboard-vendas', DashboardComponent)

// Registrar componentes dos módulos dinamicamente
const registerModuleComponents = async () => {
  const modules = moduleSystem.getAllModules()
  for (const module of modules) {
    if (module.components) {
      for (const [name, componentFactory] of Object.entries(module.components)) {
        try {
          // Resolver componente lazy loading
          const component = typeof componentFactory === 'function'
            ? await componentFactory()
            : componentFactory

          // Registrar o componente resolvido
          tabCache.registerTabComponent(name, component.default || component)
        } catch (error) {
          console.error(`Erro ao carregar componente ${name}:`, error)
        }
      }
    }
  }
}

// Registrar componentes dos módulos será feito no onMounted

// Grupos expandidos no menu
const expandedGroups = reactive({
  vendas: false,
  estoque: false,
  financeiro: false,
  fiscal: false,
  rh: false,
  esocial: false,
  'esocial-processing': false,
  industria: false,
  usuarios: false,
  templates: false
})

// Métricas e dados removidos - não utilizados

// Compromissos removidos - não utilizados

// Funções
const toggleSidebar = () => {
  try {
    sidebarOpen.value = !sidebarOpen.value

    // Fechar todos os submenus quando o sidebar for recolhido
    if (!sidebarOpen.value && expandedGroups) {
      Object.keys(expandedGroups).forEach(key => {
        if (expandedGroups && key in expandedGroups) {
          (expandedGroups as Record<string, boolean>)[key] = false
        }
      })
    }
  } catch (error) {
    console.error('Erro ao alternar sidebar:', error)
  }
}

const toggleGroup = (group: keyof typeof expandedGroups) => {
  // Se a sidebar estiver recolhida, expandir ela primeiro
  if (!sidebarOpen.value) {
    sidebarOpen.value = true
  }
  expandedGroups[group] = !expandedGroups[group]
}

// Função para expandir sidebar quando necessário
const expandSidebarIfNeeded = () => {
  if (!sidebarOpen.value) {
    sidebarOpen.value = true
  }
}

const setActiveModule = async (module: string) => {
  try {
    // Se a sidebar estiver recolhida, expandir ela primeiro
    if (!sidebarOpen.value) {
      sidebarOpen.value = true
    }

    // Verificar se já existe uma aba para este módulo
    const existingTab = tabCache.tabs.value.find(tab => tab.component === module || tab.id === module)

    if (existingTab) {
      // Se a aba já existe, apenas ativar ela e recolher a sidebar
      tabCache.switchToTab(existingTab.id)
      activeModule.value = module
      // Recolher sidebar automaticamente após ativar aba existente
      sidebarOpen.value = false
    } else {
      // Buscar componente no sistema de módulos
      const modules = moduleSystem.getAllModules()
      let moduleComponent = null

      for (const moduleObj of modules) {
        if (moduleObj.components && moduleObj.components[module]) {
          moduleComponent = moduleObj.components[module]
          break
        }
      }

      // Se encontrou o componente do módulo, registrar e criar aba
      if (moduleComponent) {
        try {
          // Resolver componente lazy loading
          const component = typeof moduleComponent === 'function'
            ? await moduleComponent()
            : moduleComponent

          // Registrar o componente resolvido
          tabCache.registerTabComponent(module, component.default || component)

          // Criar nova aba com o componente do módulo
          const tabTitle = getModuleTitle(module)
          await tabCache.addTab({
            id: module,
            title: tabTitle,
            component: module,
            closable: module !== 'dashboard'
          })
          activeModule.value = module
          // Recolher sidebar automaticamente após criar nova aba
          sidebarOpen.value = false
        } catch (error) {
          console.error(`Erro ao carregar componente ${module}:`, error)
          // Fallback para placeholder em caso de erro
          const tabTitle = getModuleTitle(module)
          await tabCache.addTab({
            id: module,
            title: tabTitle,
            component: 'dashboard',
            closable: module !== 'dashboard'
          })
          activeModule.value = module
          // Recolher sidebar automaticamente após criar aba de fallback
          sidebarOpen.value = false
        }
      } else {
        // Para módulos sem componentes específicos, usar placeholder
        const tabTitle = getModuleTitle(module)
        await tabCache.addTab({
          id: module,
          title: tabTitle,
          component: 'dashboard',
          closable: module !== 'dashboard'
        })
        activeModule.value = module
        // Recolher sidebar automaticamente após criar aba placeholder
        sidebarOpen.value = false
      }
    }

    // Manter comportamento para mobile
    if (window.innerWidth <= 768) {
      sidebarOpen.value = false
    }
  } catch (error) {
    console.error('Erro ao definir módulo ativo:', error)
    // Fallback para dashboard em caso de erro
    activeModule.value = 'dashboard'
    // Recolher sidebar mesmo em caso de erro
    sidebarOpen.value = false
  }
}

const closeTab = (tabId: string) => {
  const tab = tabCache.tabs.value.find(t => t.id === tabId)
  if (!tab || !tab.closable) return

  // Atualizar activeModule se necessário
  if (tabCache.activeTabId.value === tabId) {
    const remainingTabs = tabCache.tabs.value.filter(t => t.id !== tabId)
    if (remainingTabs.length > 0) {
      activeModule.value = remainingTabs[0].component === 'dashboard' ? 'dashboard' : remainingTabs[0].id
    }
  }

  tabCache.closeTab(tabId)
}

const switchTab = (tabId: string) => {
  const tab = tabCache.tabs.value.find(t => t.id === tabId)
  if (tab) {
    tabCache.switchToTab(tabId)
    activeModule.value = tab.component === 'dashboard' ? 'dashboard' : tab.id
  }
}

const toggleTabMenu = (tabId: string, event: Event) => {
  event.preventDefault()
  event.stopPropagation()

  // Alternar o estado do menu imediatamente
  if (activeTabMenu.value === tabId) {
    activeTabMenu.value = null
  } else {
    activeTabMenu.value = tabId
  }
}

const closeTabFromMenu = (tabId: string) => {
  activeTabMenu.value = null
  closeTab(tabId)
}

// Funções de drag and drop
const handleDragStart = (tabId: string, event: DragEvent) => {
  draggedTab.value = tabId
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', tabId)
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const handleDragEnter = (index: number) => {
  dragOverIndex.value = index
}

const handleDragLeave = () => {
  // Não limpar imediatamente para evitar flickering
}

const handleDrop = (targetIndex: number, event: DragEvent) => {
  event.preventDefault()

  if (!draggedTab.value) return

  const tabs = tabCache.tabs.value
  const draggedIndex = tabs.findIndex(tab => tab.id === draggedTab.value)

  if (draggedIndex === -1 || draggedIndex === targetIndex) return

  // Reordenar as abas usando a função do composable
  tabCache.reorderTabs(draggedIndex, targetIndex)
}

const handleDragEnd = () => {
  draggedTab.value = null
  dragOverIndex.value = null
}

// Função onDateChange removida - não utilizada

const getModuleTitle = (module: string) => {
  // Títulos estáticos para módulos básicos
  const staticTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    'dashboard-vendas': 'Dashboard Vendas',
    vendas: 'Pedidos de Venda',
    clientes: 'Cadastro de Clientes',
    propostas: 'Propostas Comerciais',
    comissoes: 'Comissões',
    produtos: 'Cadastro de Produtos',
    compras: 'Compras',
    fornecedores: 'Fornecedores',
    inventario: 'Inventário',
    almoxarifado: 'Almoxarifado',
    'contas-receber': 'Contas a Receber',
    'contas-pagar': 'Contas a Pagar',
    'fluxo-caixa': 'Fluxo de Caixa',
    bancos: 'Conciliação Bancária',
    dre: 'DRE',
    nfe: 'Nota Fiscal Eletrônica',
    nfce: 'NFC-e',
    sped: 'SPED Fiscal',
    impostos: 'Apuração de Impostos',
    funcionarios: 'Cadastro de Funcionários',
    'folha-pagamento': 'Folha de Pagamento',
    ponto: 'Controle de Ponto',
    ferias: 'Férias e Licenças',
    producao: 'Ordens de Produção',
    bom: 'Lista de Materiais (BOM)',
    qualidade: 'Controle de Qualidade',
    manutencao: 'Manutenção',
    // Módulos eSocial
    'esocial-s1000': 'S-1000 - Empregador',
    'esocial-processing': 'Processamento da informação',
    'esocial-s2200': 'S-2200 - Admissão',
    'esocial-s2300': 'S-2300 - Trabalhador sem vínculo',
    // Módulo de Usuários
    'gerenciamento-usuarios': 'Gerenciamento de Usuários',
    // Módulo de Templates
    'gerenciamento-template': 'Gerenciamento de Templates'
  }

  // Verificar títulos estáticos primeiro
  if (staticTitles[module]) {
    return staticTitles[module]
  }

  // Buscar título no sistema de módulos
  const modules = moduleSystem.getAllModules()
  for (const moduleObj of modules) {
    if (moduleObj.routes) {
      const routes = moduleObj.routes as RouteRecordRaw[]
        const route = routes.find((r: RouteRecordRaw) => r.name === module)
        if (route && route.meta && typeof route.meta === 'object' && route.meta !== null && 'title' in route.meta) {
          return (route.meta as { title: string }).title
      }
    }
  }

  return 'Módulo'
}

// Função formatCurrency removida - não utilizada

// const logout = async () => {
//   const { SwalCustom } = await import('../plugins/sweetalert')
//
//   const result = await SwalCustom.confirm(
//     'Sair da Aplicação',
//     'Tem certeza que deseja sair do sistema?',
//     'Sim, sair',
//     'Cancelar'
//   )
//
//   if (result.isConfirmed) {
//     router.push('/login')
//   }
// }

// Fechar sidebar ao clicar fora (mobile)
onMounted(async () => {
  // Registrar componentes dos módulos primeiro
  await registerModuleComponents()

  // Inicializar tema
  themeStore.initTheme()

  // Dashboard não será mais carregado automaticamente
  // O usuário deve clicar em "Dashboard Vendas" no menu CRM/Vendas para visualizar

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const sidebar = document.querySelector('.sidebar')
    const hamburger = document.querySelector('.hamburger-btn')

    // Fechar sidebar ao clicar fora
    if (sidebarOpen.value && sidebar && !sidebar.contains(target) && !hamburger?.contains(target)) {
      sidebarOpen.value = false
    }

    // Fechar menu dropdown das abas ao clicar fora
    // Verificar se o clique foi em um botão de menu ou dentro do container
    const clickedMenuButton = target.closest('.tab-menu-btn')
    const clickedMenuContainer = target.closest('.tab-menu-container')

    // Se clicou no botão do menu, não fechar (deixar o toggleTabMenu lidar com isso)
    if (clickedMenuButton) {
      return
    }

    // Se clicou fora de qualquer container de menu, fechar o dropdown
    if (!clickedMenuContainer && activeTabMenu.value) {
      activeTabMenu.value = null
    }
  })
})
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(0, 255, 127, 0.15), rgba(102, 126, 234, 0.15));
  display: flex;
  flex-direction: column;
  position: relative;
}

.dashboard-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 255, 127, 0.08), rgba(102, 126, 234, 0.08));
  z-index: -1;
}

/* Navbar Superior */
.top-navbar {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary, #667eea));
  border-bottom: 1px solid var(--border-color);
  padding: 0 2rem;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hamburger-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 3px;
  transition: all 0.3s ease;
}

.hamburger-btn span {
  width: 20px;
  height: 2px;
  background: white;
  transition: all 0.3s ease;
}

.hamburger-btn:hover span {
  background: rgba(255, 255, 255, 0.8);
}

.brand-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(0, 255, 127, 0.05);
  transition: all 0.3s ease;
}

.brand-logo:hover {
  background: rgba(0, 255, 127, 0.1);
  transform: scale(1.05);
}

.logo-icon {
  width: 32px;
  height: 32px;
  transition: all 0.3s ease;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  user-select: none;
}

.navbar-center {
  flex: 1;
  max-width: 400px;
  margin: 0 2rem;
}

.search-box {
  position: relative;
  width: 100%;
}

.search-box input {
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
}

.search-btn svg {
  width: 18px;
  height: 18px;
  fill: rgba(255, 255, 255, 0.8);
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.logout-icon {
  width: 18px;
  height: 18px;
  fill: white;
  transition: all 0.3s ease;
}

.logout-btn:hover .logout-icon {
  fill: rgba(255, 255, 255, 0.9);
}

/* Layout Principal */
.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 70px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  transition: all 0.3s ease;
  position: fixed;
  top: 70px;
  left: 0;
  bottom: 0;
  z-index: 999;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: var(--shadow-md);
}

.sidebar.sidebar-open {
  width: 280px;
}

.sidebar-open {
  transform: translateX(0);
}

.sidebar-content {
  padding: 1rem 0;
}

.sidebar-header {
  padding: 0 1rem 1rem;
  border-bottom: 1px solid var(--border-color);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar.sidebar-open .sidebar-header {
  opacity: 1;
}

.sidebar-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  user-select: none;
}

.sidebar-nav {
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 400;
  position: relative;
  justify-content: center;
  user-select: none;
  margin: 0 auto;
  width: 100%;
}

/* Quando sidebar está recolhida, centralizar ícones perfeitamente */
.sidebar:not(.sidebar-open) .nav-item {
  padding: 0.5rem 0;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

/* Ícones centralizados quando sidebar recolhida */
.sidebar:not(.sidebar-open) .nav-icon {
  width: 24px;
  height: 24px;
  margin: 0;
}

/* Esconder texto quando sidebar está recolhida */
.sidebar:not(.sidebar-open) .nav-item span {
  display: none;
}

.sidebar.sidebar-open .nav-item {
  justify-content: flex-start;
  padding: 0.75rem 1rem;
}

.nav-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
  flex-shrink: 0;
}

.nav-item span {
  opacity: 0;
  transition: opacity 0.3s ease;
  white-space: nowrap;
  width: 0;
  overflow: hidden;
}

.sidebar.sidebar-open .nav-item span {
  opacity: 1;
  width: auto;
}

.nav-item:hover {
  background: var(--accent-glow);
  color: var(--accent-primary);
}

.nav-item.active {
  background: var(--accent-glow);
  color: var(--accent-primary);
  border-right: 3px solid var(--accent-primary);
}

.nav-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.nav-group .group-header {
  justify-content: center;
  position: relative;
}

.sidebar.sidebar-open .nav-group .group-header {
  justify-content: space-between;
}

.nav-group.expanded .group-header {
  background: var(--accent-glow);
  border-radius: 6px;
  margin: 2px 0;
}

.expand-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
  transition: transform 0.3s ease;
  opacity: 0;
}

.sidebar.sidebar-open .expand-icon {
  opacity: 1;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.nav-submenu {
  background: linear-gradient(135deg, rgba(0, 255, 127, 0.05), rgba(0, 255, 127, 0.02));
  border-left: 2px solid rgba(0, 255, 127, 0.2);
  margin: 0.25rem 0;
  border-radius: 0 8px 8px 0;
  display: none;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sidebar.sidebar-open .nav-submenu {
  display: block;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nav-subitem {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 400;
  position: relative;
  user-select: none;
  border-radius: 0 6px 6px 0;
  margin: 2px 0;
}

.nav-subicon {
  width: 14px;
  height: 14px;
  fill: var(--text-muted);
  transition: all 0.3s ease;
}

.nav-subitem:hover .nav-subicon {
  fill: var(--accent-primary);
}

.nav-subitem span {
  white-space: nowrap;
  font-size: 0.8rem;
  user-select: none;
}

.nav-subitem:hover {
  background: linear-gradient(135deg, rgba(0, 255, 127, 0.15), rgba(0, 255, 127, 0.08));
  color: var(--accent-primary);
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 255, 127, 0.2);
  border-left: 3px solid var(--accent-primary);
}

.nav-subitem.active {
  background: linear-gradient(135deg, rgba(0, 255, 127, 0.2), rgba(0, 255, 127, 0.1));
  color: var(--accent-primary);
  border-left: 3px solid var(--accent-primary);
  font-weight: 500;
}

/* Conteúdo Principal */
.main-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  margin-left: 70px;
  transition: margin-left 0.3s ease;
}

/* Dashboard */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 2rem;
  user-select: none;
}

.date-filter {
  display: flex;
  align-items: center;
  min-width: 280px;
}

.date-filter .date-picker {
  width: 100%;
}

/* Cards de Métricas */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.metric-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-card.sales .metric-icon {
  background: rgba(0, 255, 127, 0.2);
}

.metric-card.products .metric-icon {
  background: rgba(54, 162, 235, 0.2);
}

.metric-card.profit .metric-icon {
  background: rgba(255, 206, 86, 0.2);
}

.metric-card.revenue .metric-icon {
  background: rgba(153, 102, 255, 0.2);
}

.metric-icon svg {
  width: 24px;
  height: 24px;
  fill: var(--accent-primary);
}

.metric-content h3 {
  margin: 0 0 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  user-select: none;
}

.metric-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  user-select: none;
}

.metric-change {
  font-size: 0.8rem;
  font-weight: 500;
  user-select: none;
}

.metric-change.positive {
  color: #10b981;
}

.metric-change.negative {
  color: #ef4444;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.chart-section,
.agenda-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.chart-section h3,
.agenda-section h3 {
  margin: 0 0 1rem;
  color: var(--text-primary);
  font-size: 1.2rem;
  user-select: none;
}

/* Gráfico Simples */
.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: end;
  justify-content: center;
}

.chart-bars {
  display: flex;
  align-items: end;
  gap: 1rem;
  height: 100%;
}

.bar {
  width: 40px;
  background: linear-gradient(to top, var(--accent-primary), rgba(0, 255, 127, 0.6));
  border-radius: 4px 4px 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
  transition: all 0.3s ease;
}

.bar:hover {
  transform: scale(1.05);
}

.bar-label {
  position: absolute;
  bottom: -25px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  user-select: none;
}

.bar-value {
  position: absolute;
  top: -25px;
  font-size: 0.7rem;
  color: var(--text-primary);
  background: var(--bg-primary);
  padding: 2px 4px;
  border-radius: 4px;
  white-space: nowrap;
  user-select: none;
}

/* Agenda */
.agenda-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.agenda-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 255, 127, 0.05);
  border-radius: 6px;
  border-left: 4px solid var(--accent-primary);
}

.appointment-time {
  font-weight: 600;
  color: var(--accent-primary);
  min-width: 50px;
  user-select: none;
}

.appointment-details {
  flex: 1;
}

.appointment-title {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  user-select: none;
}

.appointment-client {
  font-size: 0.9rem;
  color: var(--text-secondary);
  user-select: none;
}

.appointment-status {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  user-select: none;
}

.appointment-status.confirmed {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.appointment-status.pending {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.appointment-status.completed {
  background: rgba(107, 114, 128, 0.2);
  color: #6b7280;
}

.add-appointment-btn {
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: 2px dashed var(--border-color);
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.add-appointment-btn:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

/* Módulos Placeholder */
.module-content {
  padding: 0.25rem 0;
  background: transparent;
}

.module-header h2 {
  margin: 0 0 2rem;
  color: var(--text-primary);
  font-size: 2rem;
  user-select: none;
}

.module-placeholder {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
}

.placeholder-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  opacity: 0.3;
}

.placeholder-icon svg {
  width: 100%;
  height: 100%;
  fill: var(--text-secondary);
}

.module-placeholder h3 {
  margin: 0 0 1rem;
  color: var(--text-primary);
  user-select: none;
}

.module-placeholder p {
  margin: 0;
  color: var(--text-secondary);
  user-select: none;
}

/* Widgets Section */
.widgets-section {
  margin-top: 2rem;
}

.widgets-section h3 {
  margin: 0 0 1.5rem;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
  user-select: none;
}

.widgets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.widget-container {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

/* Barra de Abas */
.tabs-bar {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 0;
  position: sticky;
  top: 70px;
  z-index: 90;
  overflow-x: auto;
  overflow-y: hidden;
  box-shadow: var(--shadow-sm);
  margin-left: 70px;
  transition: margin-left 0.3s ease;
}

.tabs-container {
  display: flex;
  min-width: max-content;
  padding: 0 1rem;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
  font-size: 0.9rem;
  white-space: nowrap;
  user-select: none;
  min-width: 120px;
  justify-content: space-between;
}

.tab-item:hover {
  background: var(--input-bg);
  color: var(--text-primary);
}

.tab-item.active {
  color: var(--accent-primary);
  border-bottom-color: var(--accent-primary);
  background: var(--input-bg);
}

.tab-title {
  flex: 1;
  text-align: left;
}

.tab-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.2s ease;
  padding: 0;
  margin-left: 0.5rem;
}

.tab-close-btn:hover {
  background: var(--border-color);
  color: var(--text-primary);
}

.tab-close-btn svg {
  width: 12px;
  height: 12px;
  fill: currentColor;
}

/* Responsividade */
@media (min-width: 769px) {
  .sidebar {
    position: fixed;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .navbar-center {
    display: none;
  }

  .user-name {
    display: none;
  }

  .main-content {
    padding: 1rem;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .widgets-grid {
    grid-template-columns: 1fr;
  }

  .widget-container {
    min-height: 350px;
  }

  /* Abas responsivas */
  .tabs-bar {
    padding: 0 0.5rem;
  }

  .tab-item {
    min-width: 100px;
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }

  .tab-close-btn {
    width: 16px;
    height: 16px;
  }

  .tab-close-btn svg {
    width: 10px;
    height: 10px;
  }
}

/* Estado de Boas-vindas */
.welcome-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px);
  padding: 2rem;
}

.welcome-content {
  text-align: center;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 3rem 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.welcome-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  background: var(--accent-primary);
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(var(--accent-primary-rgb), 0.3);
}

.welcome-icon svg {
  width: 40px;
  height: 40px;
  fill: white;
}

.welcome-content h2 {
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.welcome-content > p {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.welcome-tips {
  text-align: left;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.welcome-tips h3 {
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.welcome-tips h3::before {
  content: "💡";
  font-size: 1.2rem;
}

.welcome-tips ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.welcome-tips li {
  color: var(--text-secondary);
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  line-height: 1.5;
}

.welcome-tips li::before {
  content: "•";
  color: var(--accent-primary);
  font-weight: bold;
  position: absolute;
  left: 0;
}

@media (max-width: 768px) {
  .welcome-content {
    padding: 2rem 1.5rem;
  }

  .welcome-content h2 {
    font-size: 1.5rem;
  }

  .welcome-content > p {
    font-size: 1rem;
  }

  .welcome-icon {
    width: 60px;
    height: 60px;
  }

  .welcome-icon svg {
    width: 30px;
    height: 30px;
  }
}

@media (max-width: 480px) {
  .top-navbar {
    padding: 0 0.5rem;
  }

  .brand-title {
    font-size: 1.2rem;
  }

  .main-content {
    padding: 0.5rem;
  }

  .metric-card {
    flex-direction: column;
    text-align: center;
  }
}

/* Estilos para o Menu Dropdown das Abas */
.tab-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.5rem;
}

.tab-menu-container {
  position: relative;
  z-index: 100000;
  pointer-events: auto;
}

.tab-menu-container * {
  pointer-events: auto;
}

.tab-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.7;
  padding: 4px;
}

.tab-menu-btn:hover {
  background: var(--bg-hover);
  opacity: 1;
}

.tab-menu-btn svg {
  width: 18px;
  height: 18px;
  fill: var(--text-secondary);
}

.tab-menu-btn:hover svg {
  fill: var(--text-primary);
}

.tab-item:not(.active) .tab-menu-btn {
  opacity: 0;
}

.tab-item:hover .tab-menu-btn {
  opacity: 0.7;
}

.tab-item:hover .tab-menu-btn:hover {
  opacity: 1;
  background: var(--bg-hover);
  transform: scale(1.05);
}



.tab-dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.tab-dropdown-item:hover {
  background: var(--bg-hover);
  color: var(--accent-primary);
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

/* Dropdown menu posicionado corretamente */
.tab-dropdown-menu {
  position: fixed;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999999;
  min-width: 140px;
  padding: 0.5rem 0;
  margin-top: 4px;
}

/* Estilos para Drag and Drop das Abas */
.tab-item {
  cursor: grab;
  transition: all 0.2s ease;
}

.tab-item:active {
  cursor: grabbing;
}

.tab-item.dragging {
  opacity: 0.5;
  transform: scale(0.95);
  cursor: grabbing;
}

.tab-item.drag-over {
  background: var(--accent-primary-alpha);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.tab-item[draggable="true"]:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Indicador visual de posição de drop */
.tab-item.drag-over::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--accent-primary);
  border-radius: 0 2px 2px 0;
}

.tab-item.drag-over::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--accent-primary);
  border-radius: 2px 0 0 2px;
}
</style>
