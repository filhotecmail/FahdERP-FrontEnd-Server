// Interface para itens de processamento do eSocial
export interface ProcessingItem {
  id: string
  dataProcessamento: string
  status: 'pendente' | 'processando' | 'enviado' | 'sucesso' | 'erro' | 'critica'
  matricula: string
  cpf: string
  nome: string
  evento: string
  protocolo?: string
  xmlData?: string
  nroProtocolo?: string
  nroRecibo?: string
  nroReciboExclusao?: string
}

// Função para gerar dados mockados do eSocial
export const generateMockData = (): ProcessingItem[] => {
  const nomes = [
    'João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira', 'Carlos Ferreira',
    'Lucia Almeida', 'Roberto Souza', 'Fernanda Lima', 'Marcos Pereira', 'Juliana Rocha',
    'Antonio Barbosa', 'Carla Mendes', 'Eduardo Nascimento', 'Patricia Cardoso', 'Ricardo Gomes',
    'Simone Martins', 'Fabio Ribeiro', 'Claudia Dias', 'Rodrigo Araujo', 'Vanessa Castro',
    'Alexandre Moreira', 'Renata Campos', 'Gustavo Teixeira', 'Monica Reis', 'Daniel Correia',
    'Adriana Pinto', 'Bruno Machado', 'Cristina Vieira', 'Felipe Monteiro', 'Gabriela Freitas',
    'Henrique Lopes', 'Isabella Carvalho', 'Jorge Batista', 'Karina Duarte', 'Leonardo Ramos',
    'Mariana Fernandes', 'Nicolas Andrade', 'Olivia Santana', 'Paulo Medeiros', 'Quezia Torres',
    'Rafael Cunha', 'Sabrina Moura', 'Thiago Nunes', 'Ursula Farias', 'Vinicius Barros',
    'Wesley Coelho', 'Ximena Siqueira', 'Yuri Cavalcanti', 'Zilda Matos', 'Alberto Fonseca'
  ]
  
  const sobrenomes = [
    'Silva', 'Santos', 'Costa', 'Oliveira', 'Ferreira', 'Almeida', 'Souza', 'Lima',
    'Pereira', 'Rocha', 'Barbosa', 'Mendes', 'Nascimento', 'Cardoso', 'Gomes',
    'Martins', 'Ribeiro', 'Dias', 'Araujo', 'Castro', 'Moreira', 'Campos',
    'Teixeira', 'Reis', 'Correia', 'Pinto', 'Machado', 'Vieira', 'Monteiro',
    'Freitas', 'Lopes', 'Carvalho', 'Batista', 'Duarte', 'Ramos', 'Fernandes'
  ]
  
  const status: ProcessingItem['status'][] = ['pendente', 'processando', 'enviado', 'sucesso', 'erro', 'critica']
  const eventos = ['S-2200', 'S-2300', 'S-2400']
  
  const data: ProcessingItem[] = []
  
  for (let i = 1; i <= 500; i++) {
    const nomeIndex = Math.floor(Math.random() * nomes.length)
    const sobrenomeIndex = Math.floor(Math.random() * sobrenomes.length)
    const nome = `${nomes[nomeIndex]} ${sobrenomes[sobrenomeIndex]}`
    
    // Gerar CPF aleatório
    const cpf = String(Math.floor(Math.random() * 100000000000)).padStart(11, '0')
    
    // Gerar matrícula aleatória
    const matricula = String(Math.floor(Math.random() * 99999) + 10000)
    
    // Data aleatória nos últimos 30 dias
    const dataBase = new Date()
    dataBase.setDate(dataBase.getDate() - Math.floor(Math.random() * 30))
    dataBase.setHours(Math.floor(Math.random() * 24))
    dataBase.setMinutes(Math.floor(Math.random() * 60))
    
    // Gera números de protocolo e recibo baseado em probabilidades
    const hasProtocolo = Math.random() > 0.3 // 70% chance de ter protocolo
    const hasRecibo = hasProtocolo && Math.random() > 0.4 // 60% chance de ter recibo se tem protocolo
    const hasReciboExclusao = Math.random() > 0.8 // 20% chance de ter recibo exclusão
    
    data.push({
      id: String(i),
      cpf,
      matricula,
      nome,
      status: status[Math.floor(Math.random() * status.length)],
      evento: eventos[Math.floor(Math.random() * eventos.length)],
      dataProcessamento: dataBase.toISOString(),
      nroProtocolo: hasProtocolo ? `PROT${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}` : '',
      nroRecibo: hasRecibo ? `REC${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}` : '',
      nroReciboExclusao: hasReciboExclusao ? `EXCL${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}` : ''
    })
  }
  
  return data
}

// Dados mockados pré-gerados
export const mockData: ProcessingItem[] = generateMockData()