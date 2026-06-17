const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const path    = require('path');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*' } });

app.use(express.static(path.join(__dirname, 'public')));

// ═══════════════════════════════════════════════════════════════════
//  ANATOMY QUESTION BANK  (80 questions across 5 categories)
// ═══════════════════════════════════════════════════════════════════
const QUESTIONS = [
  // ── BONES ──────────────────────────────────────────────────────
  { q:"Which bone forms the forehead?",             a:["Frontal Bone","Parietal Bone"], c:0, cat:"Bones" },
  { q:"Medical name for the kneecap?",              a:["Femur","Patella"],              c:1, cat:"Bones" },
  { q:"The collarbone is called?",                  a:["Clavicle","Scapula"],           c:0, cat:"Bones" },
  { q:"The longest bone in the human body?",        a:["Femur","Tibia"],                c:0, cat:"Bones" },
  { q:"The heel bone is called?",                   a:["Talus","Calcaneus"],            c:1, cat:"Bones" },
  { q:"Smallest bone in the human body?",           a:["Stapes","Malleus"],             c:0, cat:"Bones" },
  { q:"The lower jaw bone is called?",              a:["Maxilla","Mandible"],           c:1, cat:"Bones" },
  { q:"The upper arm bone is called?",              a:["Humerus","Radius"],             c:0, cat:"Bones" },
  { q:"The shoulder blade is called?",              a:["Scapula","Clavicle"],           c:0, cat:"Bones" },
  { q:"The breastbone is medically called?",        a:["Sternum","Clavicle"],           c:0, cat:"Bones" },
  { q:"The cheekbone is called?",                   a:["Nasal","Zygomatic"],            c:1, cat:"Bones" },
  { q:"The tailbone at the spine base is?",         a:["Sacrum","Coccyx"],              c:1, cat:"Bones" },
  { q:"An adult human has how many bones?",         a:["206","256"],                    c:0, cat:"Bones" },
  { q:"The shin bone is called?",                   a:["Fibula","Tibia"],               c:1, cat:"Bones" },
  { q:"How many pairs of ribs do humans have?",     a:["12 pairs","10 pairs"],          c:0, cat:"Bones" },
  { q:"The temple bone is called?",                 a:["Temporal","Occipital"],         c:0, cat:"Bones" },
  { q:"Cervical (neck) vertebrae count?",           a:["5","7"],                        c:1, cat:"Bones" },
  { q:"Wrist bones are collectively called?",       a:["Carpals","Tarsals"],            c:0, cat:"Bones" },
  { q:"Finger and toe bones are called?",           a:["Metatarsals","Phalanges"],      c:1, cat:"Bones" },
  { q:"The hip socket is part of the?",             a:["Ilium","Ischium"],              c:0, cat:"Bones" },
  { q:"The funny bone is part of which bone?",      a:["Humerus","Ulna"],               c:0, cat:"Bones" },
  { q:"Lumbar vertebrae count in adult?",           a:["5","7"],                        c:0, cat:"Bones" },
  { q:"The occipital bone is at the?",              a:["Back of skull","Front of skull"],c:0,cat:"Bones" },
  { q:"Floating ribs are ribs number?",             a:["11th and 12th","9th and 10th"], c:0, cat:"Bones" },
  { q:"The radius bone is found in the?",           a:["Forearm","Lower leg"],          c:0, cat:"Bones" },

  // ── MUSCLES ────────────────────────────────────────────────────
  { q:"The largest muscle in the body?",             a:["Gluteus Maximus","Quadriceps"],c:0, cat:"Muscles" },
  { q:"Strongest muscle relative to its size?",      a:["Bicep","Masseter"],           c:1, cat:"Muscles" },
  { q:"The main calf muscle is called?",             a:["Gastrocnemius","Soleus"],      c:0, cat:"Muscles" },
  { q:"The main chest muscle is?",                   a:["Pectoralis Major","Deltoid"],  c:0, cat:"Muscles" },
  { q:"The shoulder muscle is called?",              a:["Trapezius","Deltoid"],         c:1, cat:"Muscles" },
  { q:"The six-pack abdominal muscle?",              a:["Rectus Abdominis","Transversus"], c:0, cat:"Muscles" },
  { q:"Front thigh muscles are called?",             a:["Quadriceps","Hamstrings"],     c:0, cat:"Muscles" },
  { q:"Back thigh muscles are called?",              a:["Quadriceps","Hamstrings"],     c:1, cat:"Muscles" },
  { q:"The diaphragm's primary function?",           a:["Digestion","Breathing"],       c:1, cat:"Muscles" },
  { q:"The heart muscle type is?",                   a:["Skeletal","Cardiac"],          c:1, cat:"Muscles" },
  { q:"Which muscle opens and closes the eye?",      a:["Orbicularis Oculi","Frontalis"],c:0,cat:"Muscles" },
  { q:"The tongue is made of?",                      a:["Skeletal muscle","Smooth muscle"],c:0,cat:"Muscles"},

  // ── ORGANS ─────────────────────────────────────────────────────
  { q:"The largest organ of the body?",              a:["Liver","Skin"],                c:1, cat:"Organs" },
  { q:"The largest INTERNAL organ?",                 a:["Liver","Brain"],               c:0, cat:"Organs" },
  { q:"Which organ produces insulin?",               a:["Liver","Pancreas"],            c:1, cat:"Organs" },
  { q:"Which organ filters blood into urine?",       a:["Liver","Kidney"],              c:1, cat:"Organs" },
  { q:"Gas exchange (O₂/CO₂) occurs in?",           a:["Lungs","Kidneys"],             c:0, cat:"Organs" },
  { q:"Which organ produces bile?",                  a:["Pancreas","Liver"],            c:1, cat:"Organs" },
  { q:"The gallbladder stores?",                     a:["Bile","Insulin"],              c:0, cat:"Organs" },
  { q:"The voice box is called?",                    a:["Trachea","Larynx"],            c:1, cat:"Organs" },
  { q:"The windpipe is called?",                     a:["Trachea","Esophagus"],         c:0, cat:"Organs" },
  { q:"The food pipe from mouth to stomach?",        a:["Trachea","Esophagus"],         c:1, cat:"Organs" },
  { q:"Where does most digestion occur?",            a:["Small Intestine","Large Intestine"],c:0,cat:"Organs"},
  { q:"The spleen is part of which system?",         a:["Digestive","Immune/Lymphatic"],c:1, cat:"Organs" },
  { q:"Adrenal glands sit on top of?",               a:["Kidneys","Liver"],             c:0, cat:"Organs" },
  { q:"The thyroid gland is in the?",                a:["Neck","Chest"],                c:0, cat:"Organs" },
  { q:"Approximate length of the small intestine?",  a:["6–7 meters","2–3 meters"],     c:0, cat:"Organs" },
  { q:"Which organ produces red blood cells?",       a:["Spleen","Bone Marrow"],        c:1, cat:"Organs" },
  { q:"The appendix is attached to the?",            a:["Small Intestine","Large Intestine"],c:1,cat:"Organs"},
  { q:"Where is the pituitary gland located?",       a:["Brain","Neck"],                c:0, cat:"Organs" },

  // ── PHYSIOLOGY ─────────────────────────────────────────────────
  { q:"Normal adult resting heart rate?",            a:["60–100 bpm","40–60 bpm"],      c:0, cat:"Physiology" },
  { q:"Normal blood pressure?",                      a:["140/90 mmHg","120/80 mmHg"],   c:1, cat:"Physiology" },
  { q:"Normal core body temperature?",               a:["37°C","39°C"],                 c:0, cat:"Physiology" },
  { q:"Normal blood pH?",                            a:["7.0","7.4"],                   c:1, cat:"Physiology" },
  { q:"Normal blood oxygen saturation?",             a:["95–100%","80–90%"],            c:0, cat:"Physiology" },
  { q:"Red blood cells live approximately?",         a:["120 days","30 days"],          c:0, cat:"Physiology" },
  { q:"An adult human has about how much blood?",    a:["5 litres","3 litres"],         c:0, cat:"Physiology" },
  { q:"Normal adult teeth count (with wisdom)?",     a:["28","32"],                     c:1, cat:"Physiology" },
  { q:"Normal resting breathing rate?",              a:["12–20 breaths/min","30–40/min"],c:0,cat:"Physiology"},
  { q:"How long does it take to digest food?",       a:["24–72 hours","6–12 hours"],    c:0, cat:"Physiology" },
  { q:"How many chambers does the heart have?",      a:["2","4"],                       c:1, cat:"Physiology" },
  { q:"The average brain weight?",                   a:["1.4 kg","0.7 kg"],             c:0, cat:"Physiology" },

  // ── MEDICAL TERMS ──────────────────────────────────────────────
  { q:"'Cardio' refers to?",                         a:["Heart","Liver"],               c:0, cat:"Medical Terms" },
  { q:"'Hepato' refers to?",                         a:["Kidney","Liver"],              c:1, cat:"Medical Terms" },
  { q:"'Nephro' refers to?",                         a:["Kidney","Lung"],               c:0, cat:"Medical Terms" },
  { q:"'Osteo' refers to?",                          a:["Muscle","Bone"],               c:1, cat:"Medical Terms" },
  { q:"'Myo' refers to?",                            a:["Muscle","Nerve"],              c:0, cat:"Medical Terms" },
  { q:"'Dermo' refers to?",                          a:["Skin","Blood"],                c:0, cat:"Medical Terms" },
  { q:"'Neuro' refers to?",                          a:["Nerve","Muscle"],              c:0, cat:"Medical Terms" },
  { q:"'Hemo' refers to?",                           a:["Bone","Blood"],                c:1, cat:"Medical Terms" },
  { q:"'Arthro' refers to?",                         a:["Joint","Skin"],                c:0, cat:"Medical Terms" },
  { q:"'Pulmo' refers to?",                          a:["Lung","Heart"],                c:0, cat:"Medical Terms" },
  { q:"'Gastro' refers to?",                         a:["Stomach","Intestine"],         c:0, cat:"Medical Terms" },
  { q:"'Cranio' refers to?",                         a:["Skull","Spine"],               c:0, cat:"Medical Terms" },
  { q:"'Dermato' refers to?",                        a:["Skin","Bone"],                 c:0, cat:"Medical Terms" },
];

// ═══════════════════════════════════════════════════════════════════
//  ROOM MANAGEMENT
// ═══════════════════════════════════════════════════════════════════
const rooms = {};

function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const DEATH_TYPES = ['lava', 'demon', 'blades', 'crush', 'lava', 'demon']; // weighted

// ═══════════════════════════════════════════════════════════════════
//  SOCKET HANDLERS
// ═══════════════════════════════════════════════════════════════════
io.on('connection', (socket) => {
  let myRoom  = null;
  let myIndex = -1;

  // ── Create Room ──────────────────────────────────────────────
  socket.on('create_room', ({ name }) => {
    let code = genCode();
    while (rooms[code]) code = genCode();

    rooms[code] = {
      code, state: 'waiting',
      players: {}, votes: {},
      score: 0, combo: 0,
      usedQs: [],
      questionTimer: null, voteTimer: null,
      currentQ: null,
    };

    myRoom  = code;
    myIndex = 0;
    rooms[code].players[socket.id] = {
      id: socket.id, index: 0,
      name: name || 'Soul 1',
      x: 0.35, jumpY: 0,
    };

    socket.join(code);
    socket.emit('room_created', { code, index: 0 });
    console.log(`🔥 Room ${code} created by ${name}`);
  });

  // ── Join Room ─────────────────────────────────────────────────
  socket.on('join_room', ({ code, name }) => {
    const uc   = (code || '').toUpperCase().trim();
    const room = rooms[uc];

    if (!room)                                    { socket.emit('join_error', 'Room not found!'); return; }
    if (Object.keys(room.players).length >= 2)    { socket.emit('join_error', 'Room is full!');   return; }
    if (room.state !== 'waiting')                  { socket.emit('join_error', 'Game already started!'); return; }

    myRoom  = uc;
    myIndex = 1;
    room.players[socket.id] = {
      id: socket.id, index: 1,
      name: name || 'Soul 2',
      x: 0.65, jumpY: 0,
    };

    socket.join(uc);
    room.state = 'playing';

    const playerList = Object.values(room.players).map(p => ({
      id: p.id, index: p.index, name: p.name, x: p.x,
    }));

    io.to(uc).emit('game_start', { players: playerList });
    console.log(`🔥 ${name} joined ${uc} — GAME ON`);

    // First question after 20s
    room.questionTimer = setTimeout(() => triggerQuestion(uc), 20000);
  });

  // ── Position Sync ─────────────────────────────────────────────
  socket.on('move', ({ x, jumpY, jumping }) => {
    if (!myRoom || !rooms[myRoom]) return;
    const p = rooms[myRoom].players[socket.id];
    if (!p) return;
    p.x = x; p.jumpY = jumpY;
    socket.to(myRoom).emit('partner_move', { x, jumpY, jumping });
  });

  // ── Vote ──────────────────────────────────────────────────────
  socket.on('vote', ({ door }) => {
    const room = rooms[myRoom];
    if (!room || room.state !== 'question') return;
    const p = room.players[socket.id];
    if (!p || room.votes[socket.id] !== undefined) return;

    room.votes[socket.id] = door; // 0 = left, 1 = right
    socket.to(myRoom).emit('partner_voted', { door });

    // Resolve when both voted
    if (Object.keys(room.votes).length >= Object.keys(room.players).length) {
      clearTimeout(room.voteTimer);
      resolveQuestion(myRoom);
    }
  });

  // ── Disconnect ────────────────────────────────────────────────
  socket.on('disconnect', () => {
    if (!myRoom || !rooms[myRoom]) return;
    const room = rooms[myRoom];
    clearTimeout(room.questionTimer);
    clearTimeout(room.voteTimer);
    delete room.players[socket.id];
    socket.to(myRoom).emit('partner_left');
    if (Object.keys(room.players).length === 0) {
      delete rooms[myRoom];
      console.log(`🔥 Room ${myRoom} closed`);
    }
  });
});

// ─── Question Flow ────────────────────────────────────────────────
function pickQuestion(room) {
  let pool = QUESTIONS.filter((_, i) => !room.usedQs.includes(i));
  if (pool.length === 0) { room.usedQs = []; pool = QUESTIONS; }
  const idx = QUESTIONS.indexOf(pool[Math.floor(Math.random() * pool.length)]);
  room.usedQs.push(idx);
  return { ...QUESTIONS[idx], idx };
}

function triggerQuestion(code) {
  const room = rooms[code];
  if (!room || room.state !== 'playing') return;

  const q = pickQuestion(room);
  room.currentQ = q;
  room.votes    = {};
  room.state    = 'question';

  io.to(code).emit('show_question', {
    question: q.q,
    optionA:  q.a[0],
    optionB:  q.a[1],
    category: q.cat,
  });

  // 10-second vote window
  room.voteTimer = setTimeout(() => {
    if (rooms[code] && rooms[code].state === 'question') resolveQuestion(code);
  }, 10000);
}

function resolveQuestion(code) {
  const room = rooms[code];
  if (!room) return;
  room.state = 'resolving';

  const votes     = Object.values(room.votes);
  const correct   = room.currentQ.c; // 0 = left (A), 1 = right (B)
  let   chosen    = -1; // -1 means split or no vote
  let   splitVote = false;

  if (votes.length === 1) {
    chosen = votes[0];
  } else if (votes.length === 2) {
    if (votes[0] === votes[1]) chosen = votes[0];
    else { splitVote = true; chosen = -1; }
  }

  const isCorrect = chosen === correct;

  if (isCorrect) {
    room.combo++;
    room.score += 100 * room.combo;
    io.to(code).emit('question_result', {
      correct: true,
      correctLabel: room.currentQ.a[correct],
      score: room.score,
      combo: room.combo,
    });
    // Next question after 4s
    room.state = 'playing';
    room.questionTimer = setTimeout(() => triggerQuestion(code), 18000 + Math.random() * 6000);
  } else {
    room.combo = 0;
    const death = splitVote
      ? 'split'
      : DEATH_TYPES[Math.floor(Math.random() * DEATH_TYPES.length)];

    io.to(code).emit('question_result', {
      correct: false,
      splitVote,
      death,
      correctLabel: room.currentQ.a[correct],
      score: room.score,
    });

    // Resume after death animation (4s)
    setTimeout(() => {
      if (!rooms[code]) return;
      rooms[code].state = 'playing';
      io.to(code).emit('respawn');
      rooms[code].questionTimer = setTimeout(() => triggerQuestion(code), 15000 + Math.random() * 5000);
    }, 4500);
  }
}

// ─── Start ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🔥 Chain of Judgment — http://localhost:${PORT}\n`);
});
