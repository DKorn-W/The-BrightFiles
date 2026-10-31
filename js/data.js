/* ==========================================================================
   THE BRIGHT FILES — content database
   --------------------------------------------------------------------------
   To add a project: copy one object in PROJECTS, change the id/texts, done.
   To link to documentation from any text:   [[doc:cam|what is a cam?]]
   To link to another project's page:        [[p:heliox/docs/fin-efficiency|fin efficiency]]
   Inline math:  $x^2$    Bold: **text**    Code: `text`

   Block types (used in overview / docs / process):
     p        {text}
     stats    {items:[{v,l}]}
     formula  {tex, caption, vars:[[symbol, meaning]]}
     callout  {title, text, link:{to:'doc:id', label}}      <- jump-to-theory box
     steps    {items:[{h,text}]}
     parts    {title, items:[{name,material,stress,yield,note,doc}]}
     chart    {kind:'line'|'bars', title, xlabel, ylabel, series|data}
     figure   {art:'cam'|'fin'|'nn'|'chassis'|'orbit', caption}
     image    {src, caption}                                 <- your own images
     calc     {id:'fin'}                                     <- interactive calculator
   ========================================================================== */

const T = String.raw;

window.PROJECTS = [
/* ───────────────────────────── 1 · CAD / ANALYSIS ───────────────────────── */
{
  id: 'apex-gt',
  title: 'Apex GT',
  subtitle: 'Chassis CAD & stress analysis',
  category: 'CAD',
  template: true,
  tagline: 'A track car modelled piece by piece, with every critical part checked for stress.',
  accent: '#ff5a3c', accent2: '#ff3cac', art: 'rings',
  year: 2026, status: 'In progress',
  tags: ['cad', 'fea', 'chassis', 'suspension', 'stress', 'engine'],
  overview: [
    { t: 'stats', items: [{ v: '5', l: 'Parts analysed' }, { v: '1.52', l: 'Lowest safety factor' }, { v: '4130', l: 'Chromoly steel arms' }, { v: '312 kg', l: 'Dry mass (CAD)' }] },
    { t: 'figure', art: 'chassis', caption: 'Wireframe of the space-frame chassis. Each node is a joint in the FEA model.' },
    { t: 'parts', title: 'Part by part', items: [
      { name: 'Front control arm', material: 'AISI 4130 tube', stress: 302, yield: 460, note: 'Bending under cornering load.', doc: 'beam-bending' },
      { name: 'Wheel upright', material: 'Al 7075-T6', stress: 210, yield: 503, note: 'Von Mises at bearing bore.', doc: 'von-mises' },
      { name: 'Caliper bracket', material: 'Al 6061-T6', stress: 140, yield: 276, note: 'Braking torque reaction.', doc: 'stress-strain' },
      { name: 'Sub-frame rail', material: 'AISI 4130 tube', stress: 180, yield: 460, note: 'Torsion + bending.', doc: 'stress-strain' },
      { name: 'Camshaft', material: 'AISI 4140', stress: 260, yield: 655, note: 'Needs the cam profile maths first.', doc: 'cam' }
    ] },
    { t: 'callout', title: 'Need the theory?', text: 'The camshaft lift curve is explained from scratch in [[doc:cam|What is a cam?]]. The arm numbers use [[doc:beam-bending|beam bending]].', link: { to: 'doc:cam', label: 'Jump to: What is a cam?' } }
  ],
  docs: [
    { id: 'stress-strain', title: 'Stress & strain', summary: 'The two quantities every analysis starts with.', blocks: [
      { t: 'p', text: 'Stress is **force spread over an area**. Strain is how much the material **stretches relative to its length**. Together they describe how a part reacts to load.' },
      { t: 'formula', tex: T`\sigma = \frac{F}{A}\qquad \varepsilon = \frac{\Delta L}{L_0}\qquad \sigma = E\,\varepsilon`, caption: 'Hooke\'s law holds in the elastic region.', vars: [['σ', 'stress (Pa or MPa)'], ['F', 'force (N)'], ['A', 'area (mm²)'], ['ε', 'strain (dimensionless)'], ['E', 'Young\'s modulus (steel ≈ 200 GPa)']] },
      { t: 'callout', title: 'Safety factor', text: 'Safety factor $SF = \\sigma_y / \\sigma$. Below 1 the part yields. This project targets $SF \\geq 1.5$.' }
    ] },
    { id: 'beam-bending', title: 'Beam bending', summary: 'How to size a tubular control arm.', blocks: [
      { t: 'p', text: 'A control arm loaded at its tip behaves like a **cantilever beam**. The highest stress sits on the outer fibre, at the root.' },
      { t: 'formula', tex: T`\sigma_{max} = \frac{M\,c}{I}\qquad I_{tube} = \frac{\pi\,(D^4 - d^4)}{64}`, caption: 'Bending stress and the second moment of area for a hollow tube.', vars: [['M', 'bending moment = F·L'], ['c', 'distance to outer fibre = D/2'], ['I', 'second moment of area (mm⁴)'], ['D, d', 'outer / inner diameter']] },
      { t: 'steps', items: [
        { h: 'Moment', text: '$M = 1200\\,N \\times 250\\,mm = 3.0\\times10^5\\,N\\,mm$' },
        { h: 'Inertia', text: '$I = \\pi(28^4 - 24^4)/64 \\approx 13\\,886\\,mm^4$' },
        { h: 'Stress', text: '$\\sigma = 3\\times10^5 \\cdot 14 / 13886 \\approx 302\\,MPa$' },
        { h: 'Check', text: '$SF = 460/302 \\approx 1.52$ ✔' }
      ] }
    ] },
    { id: 'von-mises', title: 'Von Mises stress', summary: 'One number to compare a 3D stress state with yield.', blocks: [
      { t: 'p', text: 'Real parts see stress in several directions at once. **Von Mises** collapses them into one equivalent value you can compare with the yield strength.' },
      { t: 'formula', tex: T`\sigma_v = \sqrt{\tfrac{1}{2}\left[(\sigma_1-\sigma_2)^2+(\sigma_2-\sigma_3)^2+(\sigma_3-\sigma_1)^2\right]}`, caption: 'Yielding starts when σᵥ reaches the yield strength.', vars: [['σ₁ σ₂ σ₃', 'principal stresses']] },
      { t: 'chart', kind: 'bars', title: 'Peak von Mises per part (MPa)', data: [['Arm', 302], ['Upright', 210], ['Bracket', 140], ['Rail', 180], ['Camshaft', 260]] }
    ] },
    { id: 'cam', title: 'What is a cam?', summary: 'Turning rotation into precisely timed linear motion.', blocks: [
      { t: 'p', text: 'A cam is a rotating shape. A **follower** rides on its edge, so the follower moves up and down following the profile. In an engine this opens the valves at the right moment.' },
      { t: 'figure', art: 'cam', caption: 'Rotating cam with a follower. The lobe lifts the follower by h.' },
      { t: 'formula', tex: T`s(\theta)=\frac{h}{2}\left(1-\cos\frac{\pi\theta}{\beta}\right)\qquad a_{max}=\frac{\pi^2 h\,\omega^2}{2\beta^2}`, caption: 'Harmonic rise: smooth start and stop, no jerk at the ends.', vars: [['h', 'total lift'], ['β', 'rise angle (rad)'], ['ω', 'cam speed (rad/s)'], ['θ', 'cam angle']] },
      { t: 'callout', title: 'Why it matters here', text: 'Peak acceleration sets valve-spring force, which sets the load on the camshaft nose. That load feeds the [[doc:von-mises|von Mises check]].' }
    ] }
  ],
  process: [
    { id: 'cad-modeling', title: 'CAD modelling', summary: 'From sketch to solid, in order.', blocks: [
      { t: 'steps', items: [
        { h: 'Hard points', text: 'Fix wheel centres, pivot points and ride height in a master skeleton sketch.' },
        { h: 'Tube network', text: 'Sweep tube profiles along the skeleton to form the chassis.' },
        { h: 'Brackets', text: 'Model each bracket as its own part, mated to the skeleton.' },
        { h: 'Assembly', text: 'Check clearances and export STEP for FEA.' }
      ] },
      { t: 'image', src: '', caption: 'Drop your own CAD screenshot here: set src to images/your-file.png' }
    ] },
    { id: 'fea-setup', title: 'FEA set-up', summary: 'Mesh, constraints and loads.', blocks: [
      { t: 'p', text: 'Arms are meshed with **beam elements**, uprights with **10-node tetrahedra**. Loads come from a 1.5 g cornering case. See [[doc:stress-strain|stress & strain]] for definitions.' },
      { t: 'stats', items: [{ v: '48 k', l: 'Elements' }, { v: '1.5 g', l: 'Load case' }, { v: '3 mm', l: 'Mesh size' }] }
    ] },
    { id: 'results', title: 'Results', summary: 'What the numbers say.', blocks: [
      { t: 'chart', kind: 'bars', title: 'Safety factor per part', data: [['Arm', 1.52], ['Upright', 2.4], ['Bracket', 1.97], ['Rail', 2.56], ['Camshaft', 2.52]] },
      { t: 'callout', title: 'Next', text: 'The control arm is closest to the limit. Try a thicker wall; the maths is in [[doc:beam-bending|beam bending]].' }
    ] }
  ]
},

/* ───────────────────────────── 2 · THERMAL ──────────────────────────────── */
{
  id: 'heliox',
  title: 'Heliox Heat Sink',
  subtitle: 'Fin thermal design',
  category: 'Analysis',
  template: true,
  tagline: 'How big should the fins be? Theory, an interactive calculator, and test data.',
  accent: '#ffb020', accent2: '#ff6a00', art: 'waves',
  year: 2026, status: 'Complete',
  tags: ['heat transfer', 'fins', 'thermal', 'convection', 'aluminium'],
  overview: [
    { t: 'stats', items: [{ v: '85 W', l: 'Heat load' }, { v: '0.42 K/W', l: 'Thermal resistance' }, { v: '95 %', l: 'Fin efficiency' }, { v: '24', l: 'Fins' }] },
    { t: 'figure', art: 'fin', caption: 'Extruded aluminium heat sink. Heat flows from the base into the fins, then into the air.' },
    { t: 'callout', title: 'Need the theory?', text: 'Fin sizing depends on [[doc:fin-efficiency|fin efficiency]] and the [[doc:convection|convection coefficient]].', link: { to: 'doc:fin-efficiency', label: 'Jump to: Fin efficiency' } },
    { t: 'calc', id: 'fin' }
  ],
  docs: [
    { id: 'convection', title: 'Convection coefficient', summary: 'How well air carries heat away.', blocks: [
      { t: 'formula', tex: T`Q = h\,A\,\Delta T\qquad Nu = \frac{h\,L}{k_{fluid}}`, caption: 'Newton\'s law of cooling and the Nusselt number.', vars: [['h', 'heat transfer coefficient (W/m²K)'], ['A', 'surface area (m²)'], ['ΔT', 'surface − air temperature (K)']] },
      { t: 'stats', items: [{ v: '5–25', l: 'h natural air' }, { v: '25–250', l: 'h forced air' }, { v: '500+', l: 'h liquid' }] }
    ] },
    { id: 'fin-efficiency', title: 'Fin efficiency', summary: 'Why longer fins stop helping.', blocks: [
      { t: 'p', text: 'The fin tip is cooler than its base, so far-away metal does less work. **Efficiency** is the real heat divided by the ideal heat if the whole fin sat at base temperature.' },
      { t: 'formula', tex: T`m=\sqrt{\frac{h\,P}{k\,A_c}}\qquad \eta_f=\frac{\tanh(mL)}{mL}\qquad Q_{fin}=\sqrt{h P k A_c}\;\theta_b\tanh(mL)`, caption: 'Straight fin, insulated tip.', vars: [['P', 'fin perimeter = 2(w+t)'], ['Ac', 'cross-section = w·t'], ['k', 'conductivity (Al ≈ 205 W/mK)'], ['L', 'fin length'], ['θb', 'base excess temperature']] },
      { t: 'callout', title: 'Try it', text: 'Play with length and thickness in the [[p:heliox/overview|calculator on the overview page]].' }
    ] },
    { id: 'fin-sizing', title: 'Sizing the heat sink', summary: 'From watts to a thermal resistance.', blocks: [
      { t: 'formula', tex: T`R_{th}=\frac{\Delta T}{Q}=\frac{1}{h\,(A_{base}+\eta_f A_{fins})}`, caption: 'Lower is better. Aim for the lowest resistance that fits the volume.', vars: [['Rth', 'K/W'], ['Abase', 'exposed base area'], ['Afins', 'total fin area']] },
      { t: 'steps', items: [
        { h: 'Budget', text: 'Pick maximum chip temperature and ambient. The difference is your ΔT.' },
        { h: 'Required R', text: '$R_{req}=\\Delta T/Q$.' },
        { h: 'Choose fins', text: 'Pick $h$ from [[doc:convection|convection]], then tune fin length and count.' },
        { h: 'Verify', text: 'Check $\\eta_f > 80\\,\\%$, otherwise the extra length is wasted.' }
      ] }
    ] }
  ],
  process: [
    { id: 'design', title: 'Design iterations', summary: 'Three versions, each lower in resistance.', blocks: [
      { t: 'chart', kind: 'bars', title: 'Thermal resistance by version (K/W)', data: [['v1', 0.88], ['v2', 0.61], ['v3', 0.42]] }
    ] },
    { id: 'testing', title: 'Bench testing', summary: 'Measured vs predicted.', blocks: [
      { t: 'chart', kind: 'line', title: 'Base temperature vs time', xlabel: 'time (min)', ylabel: '°C', series: [
        { name: 'Measured', points: [[0, 25], [2, 48], [4, 59], [6, 64], [8, 66], [10, 67], [12, 67.5]] },
        { name: 'Predicted', points: [[0, 25], [2, 46], [4, 58], [6, 64], [8, 67], [10, 68], [12, 68.5]] }
      ] },
      { t: 'p', text: 'Steady state within 1 °C of the model, so the efficiency formula from [[doc:fin-efficiency|fin efficiency]] is good enough for sizing.' }
    ] }
  ]
},

/* ───────────────────────────── 3 · AI / CODE ────────────────────────────── */
{
  id: 'neura-7',
  title: 'NEURA-7',
  subtitle: 'A neural network from scratch',
  category: 'AI',
  template: true,
  tagline: 'Digit recognition built with nothing but NumPy: maths first, code second.',
  accent: '#8b6cff', accent2: '#3ccfff', art: 'orbs',
  year: 2026, status: 'In progress',
  tags: ['ai', 'neural network', 'python', 'backpropagation', 'machine learning', 'code'],
  overview: [
    { t: 'stats', items: [{ v: '64-32-10', l: 'Architecture' }, { v: '2 410', l: 'Parameters' }, { v: '96.4 %', l: 'Test accuracy' }, { v: '0.08', l: 'Final loss' }] },
    { t: 'figure', art: 'nn', caption: 'Layers of the network. Every line is a weight to learn.' },
    { t: 'callout', title: 'Need the theory?', text: 'Learning is just [[doc:gradient-descent|gradient descent]] with gradients from [[doc:backprop|backpropagation]].', link: { to: 'doc:backprop', label: 'Jump to: Backpropagation' } }
  ],
  docs: [
    { id: 'neuron', title: 'The neuron', summary: 'A weighted sum and a squashing function.', blocks: [
      { t: 'formula', tex: T`z=\mathbf{w}\cdot\mathbf{x}+b\qquad a=\sigma(z)=\frac{1}{1+e^{-z}}`, caption: 'One neuron: weights, bias, activation.', vars: [['w', 'weights'], ['x', 'inputs'], ['b', 'bias'], ['σ', 'sigmoid activation']] }
    ] },
    { id: 'gradient-descent', title: 'Gradient descent', summary: 'Walk downhill on the loss.', blocks: [
      { t: 'formula', tex: T`L=\frac{1}{n}\sum_i (\hat{y}_i-y_i)^2\qquad w \leftarrow w-\eta\,\frac{\partial L}{\partial w}`, caption: 'Mean squared error and the update rule.', vars: [['η', 'learning rate'], ['L', 'loss']] },
      { t: 'callout', title: 'Where do gradients come from?', text: 'From [[doc:backprop|backpropagation]].' }
    ] },
    { id: 'backprop', title: 'Backpropagation', summary: 'The chain rule, applied layer by layer.', blocks: [
      { t: 'formula', tex: T`\frac{\partial L}{\partial w}=\frac{\partial L}{\partial a}\cdot\frac{\partial a}{\partial z}\cdot\frac{\partial z}{\partial w}`, caption: 'Chain rule through one neuron.' },
      { t: 'steps', items: [
        { h: 'Forward', text: 'Compute activations layer by layer and store them.' },
        { h: 'Output error', text: 'Compare $\\hat{y}$ with the label.' },
        { h: 'Backward', text: 'Push the error back, multiplying by local derivatives.' },
        { h: 'Update', text: 'Apply [[doc:gradient-descent|gradient descent]] to every weight.' }
      ] }
    ] }
  ],
  process: [
    { id: 'dataset', title: 'Dataset', summary: '8×8 handwritten digits.', blocks: [
      { t: 'stats', items: [{ v: '1 797', l: 'Samples' }, { v: '64', l: 'Pixels' }, { v: '10', l: 'Classes' }] },
      { t: 'p', text: 'Pixels are scaled to 0–1 and the labels are one-hot encoded. 80 % train, 20 % test.' }
    ] },
    { id: 'training', title: 'Training run', summary: 'Loss falling over epochs.', blocks: [
      { t: 'chart', kind: 'line', title: 'Training loss', xlabel: 'epoch', ylabel: 'loss', series: [
        { name: 'train', points: Array.from({ length: 21 }, (_, i) => [i * 5, +(2.3 * Math.exp(-i / 4.5) + 0.08).toFixed(3)]) },
        { name: 'test', points: Array.from({ length: 21 }, (_, i) => [i * 5, +(2.3 * Math.exp(-i / 4.8) + 0.14).toFixed(3)]) }
      ] },
      { t: 'p', text: 'Both curves flatten after epoch ~70. Curve shape is explained in [[doc:gradient-descent|gradient descent]].' }
    ] }
  ]
},

/* ───────────────────────────── 4 · PAPER ────────────────────────────────── */
{
  id: 'low-orbit',
  title: 'Low-Orbit Decay',
  subtitle: 'Paper notes & derivations',
  category: 'Paper',
  template: true,
  tagline: 'Why small satellites fall: drag, density and a simple lifetime estimate.',
  accent: '#2ee6c5', accent2: '#2e8bff', art: 'grid',
  year: 2025, status: 'Draft',
  tags: ['paper', 'orbit', 'science', 'drag', 'satellite', 'physics'],
  overview: [
    { t: 'stats', items: [{ v: '400 km', l: 'Start altitude' }, { v: '~2.1 yr', l: 'Estimated life' }, { v: '3U', l: 'CubeSat' }] },
    { t: 'figure', art: 'orbit', caption: 'The orbit shrinks slowly, then quickly in the last few turns.' },
    { t: 'callout', title: 'Need the theory?', text: 'Start with [[doc:drag|atmospheric drag]] and [[doc:orbital-velocity|orbital velocity]].', link: { to: 'doc:drag', label: 'Jump to: Atmospheric drag' } }
  ],
  docs: [
    { id: 'orbital-velocity', title: 'Orbital velocity', summary: 'How fast you must go to stay up.', blocks: [
      { t: 'formula', tex: T`v=\sqrt{\frac{\mu}{r}}\qquad \mu=3.986\times10^{14}\,\text{m}^3/\text{s}^2`, caption: 'Circular orbit speed.', vars: [['μ', 'Earth gravitational parameter'], ['r', 'orbit radius from Earth centre']] }
    ] },
    { id: 'drag', title: 'Atmospheric drag', summary: 'Thin air, big effect over months.', blocks: [
      { t: 'formula', tex: T`F_d=\tfrac{1}{2}\,\rho\,v^2\,C_d\,A`, caption: 'Drag force on the satellite.', vars: [['ρ', 'air density (falls exponentially with altitude)'], ['Cd', 'drag coefficient ≈ 2.2'], ['A', 'frontal area']] },
      { t: 'p', text: 'Drag removes energy, so the orbit lowers, so $v$ from [[doc:orbital-velocity|orbital velocity]] increases and the air gets denser. This feedback is why the end is fast.' }
    ] }
  ],
  process: [
    { id: 'literature', title: 'Literature notes', summary: 'What the key papers say.', blocks: [
      { t: 'steps', items: [
        { h: 'King-Hele (1987)', text: 'Analytic treatment of orbital decay with an exponential atmosphere.' },
        { h: 'Vallado', text: 'Numerical propagation and density models.' },
        { h: 'This work', text: 'Compare both for a 3U CubeSat.' }
      ] }
    ] },
    { id: 'lifetime', title: 'Lifetime estimate', summary: 'Altitude vs time.', blocks: [
      { t: 'chart', kind: 'line', title: 'Altitude decay', xlabel: 'months', ylabel: 'km', series: [
        { name: 'Altitude', points: [[0, 400], [6, 392], [12, 380], [18, 360], [22, 330], [24, 290], [25, 230]] }
      ] }
    ] }
  ]
}
];

/* ───────────────────────────── GALLERY ──────────────────────────────────── */
/* Add `src: 'images/yourfile.jpg'` to use a real photo/render instead of generated art. */
window.GALLERY = [
  { title: 'Apex GT: final render', project: 'apex-gt', cat: 'CAD', style: 'rings', a: '#ff5a3c', b: '#ff3cac', caption: 'Chassis + body surfaces.' },
  { title: 'Von Mises plot: upright', project: 'apex-gt', cat: 'Analysis', style: 'waves', a: '#ff5a3c', b: '#ffb020', caption: 'Peak at bearing bore.' },
  { title: 'Heliox: v3 heat sink', project: 'heliox', cat: 'CAD', style: 'waves', a: '#ffb020', b: '#ff6a00', caption: 'Final extrusion.' },
  { title: 'Thermal image', project: 'heliox', cat: 'Analysis', style: 'orbs', a: '#ff6a00', b: '#ff3cac', caption: 'IR camera, steady state.' },
  { title: 'NEURA-7: weights', project: 'neura-7', cat: 'AI', style: 'orbs', a: '#8b6cff', b: '#3ccfff', caption: 'First-layer weights as images.' },
  { title: 'Confusion matrix', project: 'neura-7', cat: 'AI', style: 'grid', a: '#3ccfff', b: '#8b6cff', caption: '96.4 % accuracy.' },
  { title: 'Decay curve', project: 'low-orbit', cat: 'Paper', style: 'grid', a: '#2ee6c5', b: '#2e8bff', caption: 'Figure 3 of the paper.' },
  { title: 'Orbit sketch', project: 'low-orbit', cat: 'Paper', style: 'rings', a: '#2e8bff', b: '#2ee6c5', caption: 'Concept art.' }
];
