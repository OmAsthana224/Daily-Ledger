  let tasks = [];
  let idCounter = 1;
  let filter = 'all';

  const entriesEl = document.getElementById('entries');
  const input = document.getElementById('taskInput');
  const addBtn = document.getElementById('addBtn');
  const emptyState = document.getElementById('emptyState');
  const totalCount = document.getElementById('totalCount');
  const openCount = document.getElementById('openCount');
  const doneCount = document.getElementById('doneCount');
  const filterBtns = document.querySelectorAll('.filter-btn');

  document.getElementById('today').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  function addTask() {
    const text = input.value.trim();
    if (!text) return;
    tasks.push({
      id: idCounter++,
      text,
      done: false,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    });
    input.value = '';
    render();
  }

  function toggleTask(id) {
    const t = tasks.find(t => t.id === id);
    if (t) t.done = !t.done;
    render();
  }

  function removeTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    render();
  }

  function render() {
    const visible = tasks.filter(t => {
      if (filter === 'open') return !t.done;
      if (filter === 'done') return t.done;
      return true;
    });

    entriesEl.innerHTML = '';
    visible.forEach(t => {
      const li = document.createElement('li');
      li.className = 'entry' + (t.done ? ' done' : '');
      li.innerHTML = `
        <button class="stamp" aria-label="Toggle complete">✓</button>
        <span class="entry-text"></span>
        <span class="entry-time">${t.time}</span>
        <button class="remove" aria-label="Remove item">×</button>
      `;
      li.querySelector('.entry-text').textContent = t.text;
      li.querySelector('.stamp').addEventListener('click', () => toggleTask(t.id));
      li.querySelector('.remove').addEventListener('click', () => removeTask(t.id));
      entriesEl.appendChild(li);
    });

    emptyState.style.display = visible.length ? 'none' : 'block';
    if (visible.length === 0 && tasks.length > 0) {
      emptyState.textContent = filter === 'done' ? 'No completed items yet.' : 'All caught up.';
    } else {
      emptyState.textContent = 'Nothing on the books yet.';
    }

    totalCount.textContent = tasks.length;
    openCount.textContent = tasks.filter(t => !t.done).length;
    doneCount.textContent = tasks.filter(t => t.done).length;
  }

  addBtn.addEventListener('click', addTask);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filter = btn.dataset.filter;
      render();
    });
  });

  render();
