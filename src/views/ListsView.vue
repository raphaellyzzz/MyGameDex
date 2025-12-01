<template>
  <div class="lists-container">
    <h1 class="title">Listas Personalizadas</h1>

    <div class="create-box">
      <input class="input" v-model="newList.title" placeholder="Título da lista" />
      <input class="input" v-model="newList.description" placeholder="Descrição da lista" />
      <button class="btn-create" @click="createList">Criar Lista</button>
    </div>

    <hr class="divider" />

    <h2 class="subtitle">Adicionar Jogos</h2>
    <div class="games-grid">
      <div
        class="game-card"
        v-for="game in gameCatalog"
        :key="game.id"
      >
        <img :src="game.image" class="game-img" />

        <h3>{{ game.name }}</h3>

      <button
        class="btn-add"
        @click="addGameToSelectedList(game)"
        :disabled="selectedListIndex === null"
      >
        Adicionar
      </button>
      </div>
    </div>

    <hr class="divider" />

    <div
      class="list-card"
      v-for="(list, index) in lists"
      :key="index"
      @click="selectList(index)"
      :class="{ selected: selectedListIndex === index }"
    >

      <div class="list-header">
        <div>
          <h2>{{ list.title }}</h2>
          <p class="list-desc">{{ list.description }}</p>
        </div>

        <div class="actions">
          <button class="btn-edit" @click="startEditing(list, index)">Editar</button>
          <button class="btn-delete" @click="deleteList(index)">Excluir</button>
        </div>
      </div>

      <h3 class="games-title">Jogos:</h3>
      <ul class="games-list">
        <li
          v-for="(game, i) in list.games"
          :key="i"
          class="game-item"
        >
          <img :src="game.image" class="game-thumb" />
          <span>{{ game.name }}</span>

          <button
            class="btn-remove-game"
            @click="removeGameFromList(index, i)"
          >
            Remover
          </button>
        </li>
      </ul>
    </div>

    <div class="modal" v-if="editing">
      <div class="modal-content">
        <h2>Editar Lista</h2>
        <input class="input" v-model="editData.title" />
        <input class="input" v-model="editData.description" />

        <div class="modal-actions">
          <button class="btn-create" @click="confirmEdit">Salvar</button>
          <button class="btn-delete" @click="cancelEdit">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'


const gameCatalog = [
  {
    id: 1,
    name: "Fortnite",
    image: "src/assets/games_list/fortnite.webp"
  },
  {
    id: 2,
    name: "The Walking Dead",
    image: "src/assets/games_list/the_walking_dead.jpeg"
  },
  {
    id: 3,
    name: "A Plague Tale: Innocence",
    image: "src/assets/games_list/a_plague_tale.webp"
  },
  {
    id: 4,
    name: "Minecraft",
    image: "src/assets/games_list/minecraft.png"
  },
  {
    id: 5,
    name: "Fall Guys",
    image: "src/assets/games_list/fall_guys.jpeg"
  },
  {
    id: 6,
    name: "Overcooked 2",
    image: "src/assets/games_list/overcooked_2.jpeg"
  },
  {
    id: 7,
    name: "Valorant",
    image: "src/assets/games_list/valorant.webp"
  },
  {
    id: 8,
    name: "Mario Kart World",
    image: "src/assets/games_list/mariokart_world.jpg"
  },
  {
    id: 9,
    name: "Street Fighter 6",
    image: "src/assets/games_list/street_fighter_6.jpeg"
  },
  {
    id: 10,
    name: "FIFA",
    image: "src/assets/games_list/fifa.webp"
  },
    {
    id: 11,
    name: "Counter Strike 2",
    image: "src/assets/games_list/counter_strike_2.webp"
  },
    {
    id: 12,
    name: "Roblox",
    image: "src/assets/games_list/roblox.jpg"
  },
  
]

const lists = ref([])

const newList = ref({
  title: "",
  description: "",
  games: []
})

const selectedListIndex = ref(null)

function createList() {
  if (!newList.value.title.trim()) {
    alert("Insira um título.")
    return
  }

  lists.value.push({ ...newList.value })
  newList.value = { title: "", description: "", games: [] }
}

function deleteList(index) {
  if (confirm("Tem certeza que deseja excluir esta lista?")) {
    lists.value.splice(index, 1)
  }
}

function addGameToSelectedList(game) {
  if (selectedListIndex.value === null) {
    alert("Selecione uma lista primeiro!")
    return
  }

  lists.value[selectedListIndex.value].games.push(game)
}

function selectList(index) {
  selectedListIndex.value = index;
}

function removeGameFromList(listIndex, gameIndex) {
  lists.value[listIndex].games.splice(gameIndex, 1)
}


const editing = ref(false)
const editIndex = ref(null)
const editData = ref({
  title: "",
  description: ""
})

function startEditing(list, index) {
  editing.value = true
  editIndex.value = index
  editData.value = { title: list.title, description: list.description }
}

function confirmEdit() {
  lists.value[editIndex.value].title = editData.value.title
  lists.value[editIndex.value].description = editData.value.description

  editing.value = false
}

function cancelEdit() {
  editing.value = false
}
</script>

<style scoped>

.lists-container { color: white; font-family: 'Jersey 10', sans-serif; }
.title { font-size: 2rem; margin-bottom: 20px; }

.divider {
  border: none;
  height: 1px;
  background: rgba(255,255,255,0.1);
  margin: 25px 0;
}

.create-box {
  background: rgba(255,255,255,0.05);
  padding: 20px;
  border-radius: 12px;
}
.input {
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: none;
  background: rgba(255,255,255,0.1);
  color: white;
}
.btn-create {
  background: #4CAF50;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
}


.subtitle { margin-bottom: 10px; }
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 15px;
}
.game-card {
  background: rgba(255,255,255,0.08);
  padding: 10px;
  border-radius: 10px;
  text-align: center;
}
.game-img {
  width: 100%;
  height: 250px;      
  object-fit: cover;  
  border-radius: 10px;
}
.btn-add {
  background: #4CAF50;
  border: none;
  padding: 8px 15px;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 5px;
}


.list-card {
  background: rgba(255,255,255,0.08);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.actions button {
  margin-left: 10px;
}
.list-desc { opacity: 0.8; }

.selected {
  border: 2px solid #4CAF50;
  background: rgba(76, 175, 80, 0.15);
}


.games-list {
  padding: 0;
}
.game-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.05);
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
}
.game-thumb {
  width: 50px;
  border-radius: 8px;
}
.btn-remove-game {
  background: #e53935;
  border: none;
  padding: 6px 12px;
  border-radius: 10px;
  cursor: pointer;
  margin-left: auto;
}


.btn-delete {
  background: #e53935;
  border: none;
  padding: 10px 15px;
  border-radius: 10px;
  cursor: pointer;
  color: white;
}
.btn-edit {
  background: #ffc107;
  border: none;
  padding: 10px 15px;
  border-radius: 10px;
  cursor: pointer;
}


.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: rgba(0,0,0,0.9);
  padding: 25px;
  border-radius: 15px;
  width: 400px;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
</style>
