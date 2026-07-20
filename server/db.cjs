const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data.db');
let db = null;

async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
    createTables(db);
    seedData(db);
    saveDb();
  }
  return db;
}

function saveDb() {
  if (!db) return;
  fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
}

function createTables(database) {
  database.run(`CREATE TABLE IF NOT EXISTS inventory (
    id TEXT PRIMARY KEY, gradeCode TEXT NOT NULL, batchNo TEXT NOT NULL,
    quantity REAL NOT NULL, packageType TEXT DEFAULT '25kg bag', packages INTEGER DEFAULT 0,
    location TEXT NOT NULL, warehouseArea TEXT NOT NULL, inboundDate TEXT NOT NULL,
    producer TEXT NOT NULL, mfr REAL, qualityStatus TEXT DEFAULT 'pending',
    receiptNo TEXT, inspector TEXT, remark TEXT DEFAULT '')`);

  database.run(`CREATE TABLE IF NOT EXISTS receipts (
    id TEXT PRIMARY KEY, type TEXT DEFAULT 'standard', gradeCode TEXT NOT NULL,
    batchNo TEXT NOT NULL, quantity REAL NOT NULL, registrant TEXT NOT NULL,
    registerDate TEXT NOT NULL, status TEXT DEFAULT 'registered', pledgee TEXT,
    pledgeDate TEXT, pledgeAmount REAL, pledgeRate REAL, expireDate TEXT NOT NULL,
    deliveryDate TEXT, deliveryContract TEXT, counterParty TEXT, cancelDate TEXT,
    remark TEXT DEFAULT '')`);

  database.run(`CREATE TABLE IF NOT EXISTS deliveries (
    id TEXT PRIMARY KEY, contract TEXT NOT NULL, deliveryMonth TEXT NOT NULL,
    gradeCode TEXT NOT NULL, quantity REAL NOT NULL, seller TEXT NOT NULL,
    buyer TEXT NOT NULL, receiptId TEXT, status TEXT DEFAULT 'pending',
    pairDate TEXT, inspectionDate TEXT, inspectionResult TEXT,
    titleTransferDate TEXT, completeDate TEXT, deliveryFee REAL DEFAULT 0,
    remark TEXT DEFAULT '')`);

  database.run(`CREATE TABLE IF NOT EXISTS finance_records (
    id TEXT PRIMARY KEY, date TEXT NOT NULL, type TEXT NOT NULL,
    customer TEXT NOT NULL, description TEXT, amount REAL NOT NULL,
    status TEXT DEFAULT 'pending')`);

  database.run(`CREATE TABLE IF NOT EXISTS inspection_records (
    id TEXT PRIMARY KEY, gradeCode TEXT NOT NULL, batchNo TEXT NOT NULL,
    quantity REAL, agency TEXT, inspector TEXT, date TEXT, mfr REAL,
    tensile REAL, impact REAL, ash REAL, result TEXT DEFAULT 'pending',
    reportNo TEXT)`);

  database.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, role TEXT DEFAULT 'admin')`);
}

function seedData(database) {
  const hash = bcrypt.hashSync('admin123', 10);
  database.run('INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', hash, 'admin']);

  const inv = [
    ['INV20260701','T30S','20260615-T30S-01',1500,'25kg bag',60000,'A-01-01','A','2026-06-15','Sinopec Zhenhai',3.1,'qualified','DCE-WZ-20260042','SGS NB',''],
    ['INV20260702','L5E89','20260618-L5E89-01',1200,'25kg bag',48000,'A-01-02','A','2026-06-18','PetroChina Lanzhou',3.3,'qualified','DCE-WZ-20260043','CCIC WZ',''],
    ['INV20260703','S1003','20260620-S1003-01',2000,'700kg bag',2857,'B-02-01','B','2026-06-20','Zhongjing Petrochemical',3.0,'qualified','DCE-WZ-20260044','CTI','Fujian northbound'],
    ['INV20260704','T30S','20260622-T30S-02',800,'25kg bag',32000,'A-01-03','A','2026-06-22','Sinopec Zhenhai',2.9,'qualified',null,'SGS NB','Pending receipt'],
    ['INV20260705','K8003','20260625-K8003-01',600,'25kg bag',24000,'C-03-01','C','2026-06-25','Sinopec Yangzi',2.4,'qualified','DCE-WZ-20260045','SGS NB','Ningbo southbound'],
    ['INV20260706','EPS30R','20260628-EPS30R-01',1000,'700kg bag',1428,'C-03-02','C','2026-06-28','Sinopec Qilu',1.8,'qualified','DCE-WZ-20260046','CCIC WZ',''],
    ['INV20260707','F401','20260701-F401-01',450,'25kg bag',18000,'D-04-01','D','2026-07-01','Sinochem Quanzhou',2.6,'pending',null,'CTI','New arrival'],
    ['INV20260708','T30S','20260703-T30S-03',2200,'25kg bag',88000,'B-02-02','B','2026-07-03','Sinopec Zhenhai',3.2,'qualified','DCE-WZ-20260047','SGS NB','Consignment'],
    ['INV20260709','L5E89','20260705-L5E89-02',350,'25kg bag',14000,'A-02-01','A','2026-07-05','PetroChina Lanzhou',3.5,'pending',null,'CCIC WZ',''],
    ['INV20260710','K7726H','20260706-K7726H-01',300,'700kg bag',428,'D-04-02','D','2026-07-06','Sinopec Yanshan',27.5,'qualified',null,'CTI','Taizhou auto parts'],
    ['INV20260711','S1003','20260708-S1003-02',1800,'25kg bag',72000,'B-02-03','B','2026-07-08','Zhongjing Petrochemical',2.8,'qualified','DCE-WZ-20260048','CTI','Fujian northbound'],
    ['INV20260712','T30S','20260710-T30S-04',500,'25kg bag',20000,'A-02-02','A','2026-07-10','Sinopec Zhenhai',3.0,'qualified',null,'SGS NB','Jiaxing truck'],
  ];
  const istmt = database.prepare('INSERT OR IGNORE INTO inventory VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
  for (const r of inv) istmt.run(r);
  istmt.free();

  const rec = [
    ['DCE-WZ-20260042','standard','T30S','20260615-T30S-01',1500,'Wenzhou Huasu Group','2026-06-18','registered',null,null,null,null,'2027-06-17',null,null,null,null,'Zhenhai source'],
    ['DCE-WZ-20260043','standard','L5E89','20260618-L5E89-01',1200,'Cangnan Plastic No.1','2026-06-21','pledged','ICBC Wenzhou','2026-07-02',912,0.75,'2027-06-20',null,null,null,null,'Pledge loan'],
    ['DCE-WZ-20260044','standard','S1003','20260620-S1003-01',2000,'Fujian Zhongjing Trade','2026-06-23','registered',null,null,null,null,'2027-06-22',null,null,null,null,'Fujian northbound'],
    ['DCE-WZ-20260045','standard','K8003','20260625-K8003-01',600,'Taizhou Auto Parts','2026-06-28','delivering',null,null,null,null,'2027-06-27','2026-07-12','PP2609','Zhejiang Mingri',null,'PP2609 delivery'],
    ['DCE-WZ-20260046','standard','EPS30R','20260628-EPS30R-01',1000,'Qilu Petrochemical Sales','2026-07-01','registered',null,null,null,null,'2027-06-30',null,null,null,null,''],
    ['DCE-WZ-20260047','standard','T30S','20260703-T30S-03',2200,'Wenzhou Huasu Group','2026-07-06','pledged','BOC Wenzhou','2026-07-10',1672,0.80,'2027-07-05',null,null,null,null,'Pledge - procurement'],
    ['DCE-WZ-20260048','standard','S1003','20260708-S1003-02',1800,'Fujian Zhongjing Trade','2026-07-11','registered',null,null,null,null,'2027-07-10',null,null,null,null,'Fujian northbound'],
    ['DCE-WZ-20260038','standard','T30S','20260520-T30S-01',800,'Wenzhou Huasu Group','2026-05-23','cancelled',null,null,null,null,'2027-05-22','2026-06-15','PP2607','Hangzhou Lingang','2026-06-16','Delivery complete'],
  ];
  const rstmt = database.prepare('INSERT OR IGNORE INTO receipts VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
  for (const r of rec) rstmt.run(r);
  rstmt.free();

  const del = [
    ['DLV2026001','PP2607','2026-07','T30S',800,'Wenzhou Huasu Group','Hangzhou Lingang Logistics','DCE-WZ-20260038','completed','2026-06-10','2026-06-12','qualified','2026-06-15','2026-06-16',16000,'PP2607 expiry delivery'],
    ['DLV2026002','PP2609','2026-09','K8003',600,'Taizhou Auto Parts','Zhejiang Mingri Holdings','DCE-WZ-20260045','paired','2026-07-12',null,null,null,null,12000,'Early match, pending QC'],
    ['DLV2026003','PP2609','2026-09','T30S',500,'Wenzhou Huasu Group','CMST Shanghai Pudong','DCE-WZ-20260042','pending',null,null,null,null,null,0,'Await buyer confirmation'],
    ['DLV2026004','PP2608','2026-08','S1003',1000,'Fujian Zhongjing Trade','Jintian Group Longgang','DCE-WZ-20260044','inspecting','2026-07-08','2026-07-11',null,null,null,20000,'SGS NB inspecting'],
    ['DLV2026005','PP2608','2026-08','EPS30R',1000,'Qilu Petrochemical Sales','Ningbo Free Trade Zone','DCE-WZ-20260046','pending',null,null,null,null,null,0,'New receipt, awaiting match'],
    ['DLV2026006','PP2607','2026-07','L5E89',300,'Cangnan Plastic No.1','Shanghai Yuansheng Warehouse','DCE-WZ-20260043','completed','2026-06-20','2026-06-22','qualified','2026-06-28','2026-06-29',6000,'PP2607 partial delivery'],
  ];
  const dstmt = database.prepare('INSERT OR IGNORE INTO deliveries VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
  for (const r of del) dstmt.run(r);
  dstmt.free();

  const fin = [
    ['FIN001','2026-07-12','Storage Fee','Wenzhou Huasu Group','T30S/1500t/27 days',32400,'received'],
    ['FIN002','2026-07-12','Delivery Fee','Taizhou Auto Parts','K8003/600t delivery',12000,'pending'],
    ['FIN003','2026-07-10','Receipt Reg Fee','Fujian Zhongjing Trade','S1003/1800t registration',900,'received'],
    ['FIN004','2026-07-08','Pledge Fee','Cangnan Plastic No.1','L5E89/1200t pledge (Jul)',600,'receivable'],
    ['FIN005','2026-07-06','Storage Fee','Fujian Zhongjing Trade','S1003/2000t/17 days',27200,'received'],
    ['FIN006','2026-07-06','Receipt Reg Fee','Wenzhou Huasu Group','T30S/2200t registration',1100,'received'],
    ['FIN007','2026-07-04','Inspection Fee','Wenzhou Huasu Group','T30S/2200t inspection',1200,'received'],
    ['FIN008','2026-07-02','Storage Fee','Qilu Petrochemical Sales','EPS30R/1000t/4 days',3200,'received'],
    ['FIN009','2026-07-01','Receipt Reg Fee','Qilu Petrochemical Sales','EPS30R/1000t registration',500,'received'],
    ['FIN010','2026-06-29','Delivery Fee','Cangnan Plastic No.1','L5E89/300t delivery',6000,'received'],
    ['FIN011','2026-06-29','Pledge Fee','Wenzhou Huasu Group','T30S/2200t pledge (Jul)',1100,'receivable'],
    ['FIN012','2026-06-28','Storage Fee','Taizhou Auto Parts','K8003/600t/3 days',1440,'received'],
  ];
  const fstmt = database.prepare('INSERT OR IGNORE INTO finance_records VALUES (?,?,?,?,?,?,?)');
  for (const r of fin) fstmt.run(r);
  fstmt.free();

  const qc = [
    ['QC001','T30S','20260615-T30S-01',1500,'SGS','Zhang','2026-06-16',3.1,33.5,2.8,0.02,'qualified','SGS-NB-001'],
    ['QC002','L5E89','20260618-L5E89-01',1200,'CCIC','Liu','2026-06-19',3.3,32.1,2.6,0.025,'qualified','CCIC-WZ-002'],
    ['QC003','S1003','20260620-S1003-01',2000,'CTI','Chen','2026-06-21',3.0,32.8,2.7,0.018,'qualified','CTI-HZ-003'],
    ['QC004','K8003','20260625-K8003-01',600,'SGS','Zhang','2026-06-26',2.4,27.5,28.0,0.03,'qualified','SGS-NB-004'],
    ['QC005','EPS30R','20260628-EPS30R-01',1000,'CCIC','Liu','2026-06-29',1.8,26.2,32.5,0.028,'qualified','CCIC-WZ-005'],
    ['QC006','F401','20260701-F401-01',450,'CTI','Chen','2026-07-02',2.6,35.0,2.8,0.022,'pending','TBD'],
    ['QC007','T30S','20260703-T30S-03',2200,'SGS','Zhang','2026-07-04',3.2,33.0,2.9,0.019,'qualified','SGS-NB-007'],
    ['QC008','L5E89','20260705-L5E89-02',350,'CCIC','Liu','2026-07-06',3.5,31.5,2.4,0.026,'pending','TBD'],
  ];
  const qstmt = database.prepare('INSERT OR IGNORE INTO inspection_records VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)');
  for (const r of qc) qstmt.run(r);
  qstmt.free();

  saveDb();
}

module.exports = { getDb, saveDb };
