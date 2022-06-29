const cards = document.querySelectorAll('.card')
let timer = document.getElementById('timer'),
  pontos = document.getElementById('ponto'),
  cartasBloqueadas = false,
  cartaVirada = false,
  minuto = 0,
  segundo = 0,
  ponto = 0,
  totalPontos = [],
  primeiraCarta, 
  segundaCarta

if (localStorage.getItem('ponto')) {
  totalPontos = JSON.parse(localStorage.getItem('ponto'))
}
for (let p in totalPontos) {
  pontos.innerHTML += `<li>${totalPontos[p].user} = ${totalPontos[p].tempo}</li>`
}

function start() {
  segundo = 0
  minuto = 0
  ponto = 0

  for (let i = 0; i < cards.length; i++) {
    let carta = cards[i]
    carta.classList.add('flip')
  }
  cards.forEach(card => {
    let ramdomPosition = Math.floor(Math.random() * 16)
    card.style.order = ramdomPosition
  })

  setTimeout(function () {
    setTimeout(() => {
      for (let i = 0; i < cards.length; i++) {
        let carta = cards[i]
        carta.classList.remove('flip')
      }
      interval = setInterval(time, 1000)
    }, 500)

    cards.forEach(carta => {
      carta.addEventListener('click', virarCarta)
    })
    let reset = document.getElementById('start')
    reset.innerText = 'restart'
  }, 3000)
}

function virarCarta() {
  if (cartasBloqueadas) return
  if (this === primeiraCarta) return

  this.classList.add('flip')
  if (!cartaVirada) {
    cartaVirada = true
    primeiraCarta = this
    return
  }
  segundaCarta = this
  cartaVirada = false
  if (primeiraCarta.dataset.card === segundaCarta.dataset.card) {
    ponto++
    primeiraCarta.removeEventListener('click', virarCarta)
    segundaCarta.removeEventListener('click', virarCarta)
    ;[cartaVirada, cartasBloqueadas] = [false, false]
    ;[primeiraCarta, segundaCarta] = [null, null]
    if (ponto == 8) {
      clearInterval(interval)
      alert(`Terminou em: ${digito2(minuto)}:${digito2(segundo)}`)
      let userName = prompt('Digite seu nome:')
      pontos.innerHTML += `<li>${userName} = ${digito2(minuto)}:${digito2(segundo)}</li>`
      totalPontos.push({user: userName,tempo: `${digito2(minuto)}:${digito2(segundo)}`})
      localStorage.setItem('ponto', JSON.stringify(totalPontos))
    }
    return
  }
  cartasBloqueadas = true
  setTimeout(() => {
    primeiraCarta.classList.remove('flip')
    segundaCarta.classList.remove('flip')
    ;[cartaVirada, cartasBloqueadas] = [false, false]
    ;[primeiraCarta, segundaCarta] = [null, null]
  }, 1000)
}

function digito2(digito) {
  var convertido = digito < 10 ? '0' + digito : digito
  return convertido
}

function time() {
  document.getElementById('timer').innerText = digito2(minuto) + ':' + digito2(segundo)
  if (segundo == 60) {
    minuto++
    segundo = 0
  }
  segundo++
}
