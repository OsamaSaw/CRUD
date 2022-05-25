const update = document.querySelector('#update-button')
const deleteButton = document.querySelector('#delete-button')
const messageDiv = document.querySelector('#message')
const old_q = document.querySelector('#oldQ')
const new_q = document.querySelector('#newQ')
const delquote = document.querySelector('#quote')

update.addEventListener('click', _ => {
    fetch('/creatingpost', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        oldq: old_q.value,
        newq: new_q.value
      })

    })

    .then(res => {
      if (res.ok) return res.json()
    })
    .then(response => {
      window.location.reload(true)
    })
  })


  deleteButton.addEventListener('click', _ => {
    fetch('/creatingpost', {
      method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quote: delquote.value
      })
    })
    .then(res => {
      if (res.ok) return res.json()
    })
    .then(response => {
      if (response === 'No quote to delete') {
        messageDiv.textContent = 'No quotes to delete'
      } else {
        window.location.reload(true)
      }
    })

    
  })
