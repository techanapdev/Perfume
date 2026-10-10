// Run in the Figma Plugin API context for the existing Perfume FigJam file.
// This is not browser-console JavaScript and does not change any DB schema.
async function repairPerfumeConnections() {
  if (figma.editorType !== 'figjam') throw new Error('Open the Perfume FigJam file first.');
  const sections = figma.currentPage.children.filter(
    (node) => node.type === 'SECTION' && ['Outline', 'Full'].includes(node.name)
  );
  if (sections.length !== 2) throw new Error('Expected the Outline and Full sections.');
  const originalIds = ["1:1125","1:1129","1:1133","1:1137","1:1141","1:1145","1:1149","1:1153","1:1157","1:1161","1:1165","1:1169","1:1173","1:1177","1:1181","1:1185","1:1189","1:1193","1:1197","1:1201","1:1205","1:1209","1:1213","1:1217","1:1221","1:1225","1:1229","1:1233","1:1237","2:2884","2:2888","2:2892","2:2896","2:2900","2:2904","2:2908","2:2912","2:2916","2:2920","2:2924","2:2928","2:2932","2:2936","2:2940","2:2944","2:2948","2:2952","2:2956","2:2960","2:2964","2:2968","2:2972","2:2976","2:2980","2:2984","2:2988","2:2992","2:2996"];
  const originals = await Promise.all(originalIds.map((id) => figma.getNodeByIdAsync(id)));
  if (originals.some((node) => !node || node.type !== 'CONNECTOR')) {
    throw new Error('Original connectors have changed. Inspect the file before retrying.');
  }
  for (const section of sections) {
    const count = originals.filter((node) => node.parent.id === section.id).length;
    if (count !== 29) throw new Error('Expected 29 original connectors in each section.');
  }
  const fonts = new Map(originals.map((node) => [JSON.stringify(node.text.fontName), node.text.fontName]));
  await Promise.all([...fonts.values()].map((font) => figma.loadFontAsync(font)));
  const probe = await figma.getNodeByIdAsync('15:2944');
  const changed = [];
  const created = [];
  const mapping = [];
  const reflow = [];
  const backup = figma.createSection();
  created.push(backup.id);
  backup.name = 'Original generated paths (hidden rollback)';
  backup.x = Math.max(...sections.map((node) => node.x + node.width)) + 800;
  backup.y = 0;
  backup.resize(400, 400);
  backup.visible = false;
  for (const section of sections) {
    const tables = section.children.filter((node) => node.type === 'TABLE');
    if (tables.length !== 26) throw new Error('Expected 26 tables in each view.');
    const columns = new Map();
    for (const table of tables) {
      const column = Math.round(table.x);
      if (!columns.has(column)) columns.set(column, []);
      columns.get(column).push(table);
    }
    // The earlier font sizing expanded rows. Restore spacing before creating paths.
    for (const column of columns.values()) {
      column.sort((left, right) => left.y - right.y);
      let bottom = 0;
      for (const table of column) {
        if (table.y < bottom + 96) {
          const previousY = table.y;
          table.y = bottom + 96;
          reflow.push({ id: table.id, from: previousY, to: table.y });
          changed.push(table.id);
        }
        bottom = table.y + table.height;
      }
    }
    section.resize(section.width, Math.max(...tables.map((table) => table.y + table.height)) + 120);
    changed.push(section.id);
    const byId = new Map(tables.map((table) => [table.id, table]));
    const connections = originals.filter((node) => node.parent.id === section.id);
    for (const original of connections) {
      const start = byId.get(original.connectorStart.endpointNodeId);
      const finish = byId.get(original.connectorEnd.endpointNodeId);
      if (!start || !finish) throw new Error('Unexpected FK endpoint.');
      const canReuseProbe = original.id === '1:1189' && probe && probe.type === 'CONNECTOR';
      const connector = canReuseProbe ? probe : figma.createConnector();
      (canReuseProbe ? changed : created).push(connector.id);
      section.appendChild(connector);
      const deltaX = finish.x + finish.width / 2 - start.x - start.width / 2;
      const deltaY = finish.y + finish.height / 2 - start.y - start.height / 2;
      const isHorizontal = Math.abs(deltaX) > Math.max(start.width, finish.width) / 2;
      const startMagnet = isHorizontal ? (deltaX > 0 ? 'RIGHT' : 'LEFT') : (deltaY > 0 ? 'BOTTOM' : 'TOP');
      const endMagnet = isHorizontal ? (deltaX > 0 ? 'LEFT' : 'RIGHT') : (deltaY > 0 ? 'TOP' : 'BOTTOM');
      connector.connectorLineType = 'ELBOWED';
      connector.connectorStart = { endpointNodeId: start.id, magnet: startMagnet };
      connector.connectorEnd = { endpointNodeId: finish.id, magnet: endMagnet };
      connector.connectorStartStrokeCap = original.connectorStartStrokeCap;
      connector.connectorEndStrokeCap = original.connectorEndStrokeCap;
      connector.strokes = original.strokes;
      connector.strokeWeight = original.strokeWeight;
      connector.dashPattern = original.dashPattern;
      connector.text.fontName = original.text.fontName;
      connector.text.fontSize = original.text.fontSize;
      connector.text.characters = original.text.characters;
      connector.name = start.name + ' -> ' + finish.name + ' | ' + original.text.characters;
      mapping.push({ view: section.name, originalId: original.id, connectorId: connector.id,
        startId: start.id, endId: finish.id, label: connector.text.characters });
      backup.appendChild(original);
      original.visible = false;
      changed.push(original.id);
    }
  }
  for (const section of sections) {
    const connections = section.children.filter((node) => node.type === 'CONNECTOR' && node.visible);
    if (connections.length !== 29) throw new Error('Connector count did not match.');
    for (const connector of connections) {
      const original = mapping.find((entry) => entry.connectorId === connector.id);
      if (!original || connector.connectorStart.endpointNodeId !== original.startId ||
          connector.connectorEnd.endpointNodeId !== original.endId) throw new Error('FK changed.');
    }
  }
  return { createdNodeIds: created, mutatedNodeIds: changed, backupId: backup.id, mapping, reflow };
}

// A second run intentionally stops at preflight: never create duplicate replacements.
repairPerfumeConnections().then((result) => {
  console.log(JSON.stringify(result, null, 2));
  figma.notify('Repaired Outline 29/29 + Full 29/29 connections. Browser acceptance pending.', { timeout: 20000 });
}).catch((error) => {
  console.error(error.message);
  figma.notify(error.message, { error: true, timeout: 20000 });
});
