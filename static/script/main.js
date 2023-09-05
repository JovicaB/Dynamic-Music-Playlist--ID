document.addEventListener('DOMContentLoaded', function () {
  const table = document.getElementById('playlist_table')
  let song_category_selection = null
  var songType1 = null
  var songType2 = null
  let playlist_args_list = []

  let playlistData = {
    1: {
      playlist_args: [null, null],
      playlistContent: [],
    },
  }

  let playlist_page = 1

  const upControl = document.getElementById('up_control')
  const downControl = document.getElementById('down_control')

  upControl.style.pointerEvents = 'none'
  downControl.style.pointerEvents = 'none'

  upControl.style.color = 'rgb(85, 85, 85)'
  downControl.style.color = 'rgb(85, 85, 85)'

  document
    .querySelector('.type_selection')
    .addEventListener('click', function (event) {
      const clickedElement = event.target
      if (clickedElement.tagName === 'P') {
        const letter = clickedElement.textContent
        song_category_selection = letter
        songType1 = song_category_selection
        initialPlaylist(song_category_selection)
          .then((dataArray) => {
            populateTable(dataArray)
            songType2 = songType1
            playlist_args_list = [songType1, songType2]
            downControl.style.pointerEvents = 'auto'
            downControl.style.color = '#b2b2b2'
            disableCategoryButtons(clickedElement)
            addClickedClassToElement(clickedElement)
            writePlaylistData(1, song_category_selection, dataArray)
            statistics()
          })
          .catch((error) => {
            console.error(error)
          })
      }
    })

  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i]
    row.addEventListener('click', function () {
      const rowData = []
      for (let j = 0; j < row.cells.length; j++) {
        rowData.push(row.cells[j].textContent)
      }
      const rowContent = rowData.join(', ')
      song_category = rowContent

      songType2 = rowContent
      playlist_args_list = [songType1, songType2]
    })
  }

  function initialPlaylist(input) {
    const url = createEndpoint('/generate_initial_List')
    const data = input
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.text()
      })
      .then((data) => {
        const data_array = JSON.parse(data)
        return data_array
      })
      .catch((error) => {
        console.error(error)
        return []
      })
  }

  function extendPlaylist(input) {
    songType1 = songType2
    return new Promise((resolve, reject) => {
      const url = createEndpoint('/extend_playlist')
      const data = input

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.text()
        })
        .then((data) => {
          const data_array = JSON.parse(data)
          resolve(data_array)
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  }

  function disableCategoryButtons(element) {
    if (!element.classList.contains('clicked')) {
      element.classList.add('clicked')
      addClickedClassToAllPElements()
    }
  }

  function readPlaylistData(incrementation) {
    if (
      isNaN(incrementation) ||
      incrementation < 1 ||
      incrementation > Object.keys(playlistData).length
    ) {
      console.error('Invalid incrementation value.')
      return []
    }
    return playlistData[incrementation].playlistContent
  }

  function writePlaylistData(incrementation, args, data) {
    playlistData[incrementation] = {
      playlist_args: args,
      playlistContent: data,
    }
    return playlistData
  }

  function removePlaylistData(incrementation) {
    if (
      isNaN(incrementation) ||
      incrementation < 1 ||
      incrementation > Object.keys(playlistData).length
    ) {
      console.error('Invalid incrementation value.')
      return
    }
    delete playlistData[incrementation]
  }

  upControl.addEventListener('click', function () {
    scrollUp()
  })

  downControl.addEventListener('click', function () {
    scrollDown()
  })

  function scrollUp() {
    upControl.style.pointerEvents = 'auto'
    upControl.style.color = '#b2b2b2'

    if (playlist_page > 1) {
      playlist_page--
      const data_array = readPlaylistData(playlist_page)
      populateTable(data_array)
      removePlaylistData(playlist_page + 1)
      statistics()
    } else {
      upControl.style.pointerEvents = 'none'
      upControl.style.color = 'rgb(85, 85, 85)'
    }

    if (playlist_page === 1) {
      upControl.style.pointerEvents = 'none'
      upControl.style.color = 'rgb(85, 85, 85)'
    }
  }

  function scrollDown() {
    incrementation = ++playlist_page
    playlist_page = incrementation
    dataArray = extendPlaylist(playlist_args_list)
      .then((dataArray) => {
        populateTable(dataArray)
        writePlaylistData(playlist_page, playlist_args_list, dataArray)
        statistics()
      })
      .catch((error) => {
        console.error(error)
      })

    upControl.style.pointerEvents = 'auto'
    upControl.style.color = '#b2b2b2'
  }

  function populateTable(dataArray) {
    const table = document.getElementById('playlist_table')
    if (table.rows.length !== dataArray.length) {
      console.error(
        'Table does not have 8 rows or array length does not match.'
      )
      return
    }
    for (let i = 0; i < dataArray.length; i++) {
      const cell = table.rows[i].cells[0]
      cell.textContent = dataArray[i]
    }
    playlistStyle()
  }

  function addClickedClassToAllPElements() {
    const container = document.querySelector('.type_selection')
    const elements = container.querySelectorAll('p')
    elements.forEach((element) => {
      if (!element.classList.contains('clicked')) {
        element.classList.add('disabled')
      }
    })
  }

  function addClickedClassToElement(element) {
    if (!element.classList.contains('clicked')) {
      element.classList.add('clicked')
      addClickedClassToAllPElements()
    }
  }

  function countOccurrences(searchString) {
    let totalCount = 0

    // Loop through each key in the playlistData object
    for (const key in playlistData) {
      if (playlistData.hasOwnProperty(key)) {
        const playlistContent = playlistData[key].playlistContent

        // Loop through the playlistContent array and count occurrences of the search string
        for (const item of playlistContent) {
          if (item === searchString) {
            totalCount++
          }
        }
      }
    }

    return totalCount
  }

  function statistics() {
    let keyCount = Object.keys(playlistData).length

    //OVO SADA NE VALJA JER SU SVI PODACI NE U REDOVIMA VEC U HASH MAPI
    var rowCount = keyCount * 8
    var countSongs = document.getElementById('stat_count')
    countSongs.textContent = rowCount

    var countA = document.getElementById('stat_A')
    percentage_A = (countOccurrences('A') / rowCount) * 100
    countA.textContent = percentage_A.toFixed(2) + '%'

    var countB = document.getElementById('stat_B')
    percentage_B = (countOccurrences('B') / rowCount) * 100
    countB.textContent = percentage_B.toFixed(2) + '%'

    var countC = document.getElementById('stat_C')
    percentage_C = (countOccurrences('C') / rowCount) * 100
    countC.textContent = percentage_C.toFixed(2) + '%'

    var countD = document.getElementById('stat_D')
    percentage_D = (countOccurrences('D') / rowCount) * 100
    countD.textContent = percentage_D.toFixed(2) + '%'

    var countE = document.getElementById('stat_E')
    percentage_E = (countOccurrences('E') / rowCount) * 100
    countE.textContent = percentage_E.toFixed(2) + '%'

    var countF = document.getElementById('stat_F')
    percentage_F = (countOccurrences('F') / rowCount) * 100
    countF.textContent = percentage_F.toFixed(2) + '%'

    var countG = document.getElementById('stat_G')
    percentage_G = (countOccurrences('G') / rowCount) * 100
    countG.textContent = percentage_G.toFixed(2) + '%'

    var countH = document.getElementById('stat_H')
    percentage_H = (countOccurrences('H') / rowCount) * 100
    countH.textContent = percentage_H.toFixed(2) + '%'

    return rowCount
  }

  function playlistStyle() {
    const table = document.getElementById('playlist_table')
    const rows = table.getElementsByTagName('tr')

    for (let i = 0; i < rows.length; i++) {
      const cell = rows[i].getElementsByTagName('td')[0] // Assuming there's only one cell per row
      if (cell) {
        const content = cell.textContent.trim()
        switch (content) {
          case 'A':
            cell.className = 'A'
            break
          case 'B':
            cell.className = 'B'
            break
          case 'C':
            cell.className = 'C'
            break
          case 'D':
            cell.className = 'D'
            break
          case 'E':
            cell.className = 'E'
            break
          case 'F':
            cell.className = 'F'
            break
          case 'G':
            cell.className = 'G'
            break
          case 'H':
            cell.className = 'H'
            break
          default:
            cell.className = ''
            break
        }
      }
    }
  }
})

//HELP MODALS
var h1_modal = document.getElementById('h1_modal')
var h2_modal = document.getElementById('h2_modal')
var h3_modal = document.getElementById('h3_modal')
var h4_modal = document.getElementById('h4_modal')
var h5_modal = document.getElementById('h5_modal')

var h1_button = document.getElementById('help_modal_1')
var h2_button = document.getElementById('help_modal_2')
var h3_button = document.getElementById('help_modal_3')
var h4_button = document.getElementById('help_modal_4')
var h5_button = document.getElementById('help_modal_5')

var h1_modal_close = document.getElementById('h1_modal_close')
var h2_modal_close = document.getElementById('h2_modal_close')
var h3_modal_close = document.getElementById('h3_modal_close')
var h4_modal_close = document.getElementById('h4_modal_close')
var h5_modal_close = document.getElementById('h5_modal_close')

h1_button.onclick = function () {
  h1_modal.style.display = 'flex'
}
h2_button.onclick = function () {
  h2_modal.style.display = 'flex'
}
h3_button.onclick = function () {
  h3_modal.style.display = 'flex'
}
h4_button.onclick = function () {
  h4_modal.style.display = 'flex'
}
h5_button.onclick = function () {
  h5_modal.style.display = 'flex'
}

h1_modal_close.onclick = function () {
  h1_modal.style.display = 'none'
}
h2_modal_close.onclick = function () {
  h2_modal.style.display = 'none'
}
h3_modal_close.onclick = function () {
  h3_modal.style.display = 'none'
}
h4_modal_close.onclick = function () {
  h4_modal.style.display = 'none'
}
h5_modal_close.onclick = function () {
  h5_modal.style.display = 'none'
}

window.onclick = function (event) {
  if (
    event.target === h1_modal ||
    event.target === h2_modal ||
    event.target === h3_modal ||
    event.target === h4_modal ||
    event.target === h5_modal
  ) {
    h1_modal.style.display = 'none'
    h2_modal.style.display = 'none'
    h3_modal.style.display = 'none'
    h4_modal.style.display = 'none'
    h5_modal.style.display = 'none'
  }
}
