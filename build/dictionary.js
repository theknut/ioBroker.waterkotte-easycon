"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var dictionary_exports = {};
__export(dictionary_exports, {
  WaterkotteDictionary: () => WaterkotteDictionary
});
module.exports = __toCommonJS(dictionary_exports);
var import_types = require("./types");
class WaterkotteDictionary {
  getTranslations(identifiers, language, separator = ".") {
    var _a;
    if (!language) {
      throw new import_types.AdapterError(`Could not get '${language}' translation for ${identifiers}`);
    }
    const translated = this.getTranslation(identifiers, separator);
    const translatedLanguage = (_a = translated[language]) != null ? _a : translated["en"];
    if (!translatedLanguage) {
      throw new import_types.AdapterError(`Could neither get '${language}' nor 'en' translation for ${identifiers}`);
    }
    return translatedLanguage;
  }
  getTranslation(identifiers, separator = ".") {
    const translated = this.toStringOrTranslated(
      (typeof identifiers === "string" ? [identifiers] : identifiers).map((identifier) => {
        const dict = this["lng" + identifier];
        return Array.isArray(dict) ? dict : [identifier];
      }),
      separator
    );
    return translated;
  }
  toStringOrTranslated(dicts, separator = ".") {
    return {
      de: dicts.map((dict) => this.normalize(dict[0], separator)).join(separator),
      en: dicts.map((dict) => this.normalize(dict.length > 1 ? dict[1] : dict[0], separator)).join(separator),
      // fall back to German
      fr: dicts.map(
        (dict) => this.normalize(dict.length > 2 ? dict[2] : dict.length > 1 ? dict[1] : dict[0], separator)
      ).join(separator)
      // fall back to English or German
    };
  }
  normalize(str, separator) {
    return str.replaceAll(separator, "");
  }
  aLNG = ["de", "en", "fr"];
  iLng = this.aLNG.indexOf("de");
  lngDE = ["Deutsch", "Deutsch", "Deutsch"];
  lngGB = ["English", "English", "English"];
  lngFR = ["Fran\xE7ais", "Fran\xE7ais", "Fran\xE7ais"];
  lngNL = ["Nederlands", "Nederlands", "Nederlands"];
  lngFI = ["Suomi", "Suomi", "Suomi"];
  lngCZ = ["Ceska", "Ceska", "Ceska"];
  lngES = ["Espa\xF1ol", "Espa\xF1ol", "Espa\xF1ol"];
  lngPT = ["Portugu\xEAs", "Portugu\xEAs", "Portugu\xEAs"];
  lngPL = ["Polski", "Polski", "Polski"];
  lngSE = ["Svenska", "Svenska", "Svenska"];
  lngRU = ["Russisch", "Russe"];
  lngIT = ["Italiano"];
  lngHU = ["Magyar", "Magyar", "Magyar"];
  lngMonday = ["Montag", "Monday", "Lundi"];
  lngTuesday = ["Dienstag", "Tuesday", "Mardi"];
  lngWednesday = ["Mittwoch", "Wednesday", "Mercredi"];
  lngThursday = ["Donnerstag", "Thursday", "Jeudi"];
  lngFriday = ["Freitag", "Friday", "Vendredi"];
  lngSaturday = ["Samstag", "Saturday", "Samedi"];
  lngSunday = ["Sonntag", "Sunday", "Dimache"];
  lngMo = ["Mo", "Mo", "Lu"];
  lngTu = ["Di", "Tu", "Ma"];
  lngWe = ["Mi", "We", "Me"];
  lngTh = ["Do", "Th", "Je"];
  lngFr = ["Fr", "Fr", "Ve"];
  lngSa = ["Sa", "Sa", "Sa"];
  lngSu = ["So", "Su", "Di"];
  lngJanuary = ["Januar"];
  lngFebruary = ["Februar"];
  lngMarch = ["M\xE4rz"];
  lngApril = ["April"];
  lngMay = ["Mai"];
  lngJune = ["Juni"];
  lngJuly = ["Juli"];
  lngAugust = ["August"];
  lngSeptember = ["September"];
  lngOctober = ["Oktober"];
  lngNovember = ["November"];
  lngDecember = ["Dezember"];
  lngMonth_0 = ["Jan"];
  lngMonth_1 = ["Feb"];
  lngMonth_2 = ["Mrz"];
  lngMonth_3 = ["Apr"];
  lngMonth_4 = ["Mai"];
  lngMonth_5 = ["Jun"];
  lngMonth_6 = ["Jul"];
  lngMonth_7 = ["Aug"];
  lngMonth_8 = ["Sep"];
  lngMonth_9 = ["Okt"];
  lngMonth_10 = ["Nov"];
  lngMonth_11 = ["Dez"];
  lngStart = ["Beginn", "Start", "Start"];
  lngStop = ["Ende", "Stop", "Stop"];
  lngWD = ["ganzt\xE4gig"];
  lngEnabled = ["Aktiv", "Enabled", "Actif"];
  lngDisabled = ["Inaktiv", "Disabled"];
  lngIncrease = ["Anhebung", "Increase", "Augmentation"];
  lngClock = ["Uhr", "Clock", "Heure"];
  lngUnknown = ["unbekannt", "undefined"];
  lngTTEdit = ["Zeiten editieren", "Edit", "Modifier l'heure"];
  lngTTEditT = ["Temperatur editieren", "Edit temperature", "Modifier la temp\xE9rature"];
  lngHome = ["\xDCbersicht", "Overview", "Aper\xE7u"];
  lngHeat = ["Heizen", "Heating", "Chauffage"];
  lngCool = ["K\xFChlen", "Cooling", "Rafraichissement"];
  lngHh2o = ["Warmwasser", "Hot water", "ECS"];
  lngCPD = ["Energiebilanz", "Energy balance", "Bilan \xE9nerg\xE9tique"];
  lngPool = ["Pool", "Pool", "Piscine"];
  lngSolar = ["Solarregelung", "Solar", "Solaire"];
  lngHDay = ["Urlaubsfunktion", "Holiday", "Fonction vacances"];
  lngD701 = this.lngHDay;
  lngOpH = ["Betriebsstunden", "Operating hours", "Heures d'activit\xE9"];
  lngDLog = ["Datenlogger", "Data logger", "Enregistreur de donn\xE9es"];
  lngMail = ["Netzwerk", "Network", "R\xE9seau"];
  lngAlarm = ["Alarm", "Alarm", "Alarme"];
  lngIPAdress = ["IP Adresse", "IP address", "Adresse IP"];
  lngMacAdress = ["Mac Adresse", "Mac address", "Adresse Mac"];
  lngpCOWeb = ["pCOWeb Firmware", "pCOWeb Firmware", "pCOWeb Firmware"];
  lngFirmware = ["Firmware Version", "Firmware version", "Firmware Version"];
  lngBIOS = ["BIOS", "BIOS", "BIOS"];
  lngBuild = ["Build", "Build", "Build"];
  lngDateTime = ["Datum/Zeit", "Date/Time", "Date/Heure"];
  lngDate = ["Datum", "Date", "Date"];
  lngTime = ["Zeit", "Time"];
  lngHPSeries = ["W\xE4rmepumpen-Baureihe", "Series", "Serie"];
  lngHPType = ["W\xE4rmepumpen-Typ", "Type", "Type PAC"];
  lngHPSerialNr = ["W\xE4rmepumpen-Seriennummer", "Serial number", "Num\xE9ro de s\xE9rie"];
  lngMValues = ["Messwerte", "Measured values", "Valeurs mesur\xE9es"];
  lngOpState = ["Betriebszustand", "Operating state", "condition de fonctionnement"];
  lngInformation = ["Informationen", "Information", "Information"];
  lngSysInfo = ["Systeminformationen"];
  lngSettings = ["Einstellungen", "Settings", "R\xE9glage"];
  lngTimeTable = ["Zeitprogramm", "Schedule", "Programme horaire"];
  lngCurve = ["Kennlinie", "Heating curve", "Courbe caract\xE9ristique"];
  lngInfluence = ["Raumeinfluss", "Room", "Influence de la pi\xE8ce"];
  lngExtended = ["Erweitert", "Extended"];
  lngThermalDis = ["Therm. Desinfektion", "Therm. sterilisation", "D\xE9sinfection thermique"];
  lngSolarSupp = ["Solarunterst\xFCtzung", "Solar support", "Appoint solaire"];
  lngCPDPower = ["Leistungsbilanz", "Energy balance", "Bilan de puissance"];
  lngMonthlyBalance = ["Monatsbilanz", "Monthly balance", "Bilan mensuel"];
  lngBalanceSheet = ["Jahresbilanz", "Balance sheet", "Bilan annuel"];
  lngBalanceTotal = ["Gesamtbilanz"];
  lngAddOptions = ["Zusatzfunktionen", "Additional features", "Fonctions annexes"];
  lngOpHFull = ["Vollbetriebsstunden", "Operating hours", "Heures d'activit\xE9 totales"];
  lngOpHDefrost = ["Betriebsstunden Abtauvorgang", "Operating hours defrost", "Heures d'activit\xE9 d\xE9givrage"];
  lngOpHBivalent = ["Betriebsstunden Bivalent", "Operating hours bivalent", "Heures d'activit\xE9 bivalent"];
  lngOpHOpM = ["Betriebsstunden Betriebsmodus", "Operating hours", "Heures d'activit\xE9 mode de fonctionnement"];
  lngOpHPV = ["Betriebsstunden Photovoltaik", "Operating hours PV", "Heures d'activit\xE9 photovolta\xEFque"];
  lngXYAxis = ["X-Y-Achse", "X-Y-Axis", "Axe X-Y"];
  lngNetwork = ["Netzwerk", "Home network", "R\xE9seau local"];
  lngNWSettings = ["Netzwerkeinstellungen", "Network settings", "R\xE9glage du r\xE9seau"];
  lngEMailAccount = ["E-Mail Kontodaten", "E-mail account data", "Donn\xE9es du compte E-mail"];
  lngWarnings = ["Warnungen", "Warning", "Avertissements"];
  lngInterruptions = ["Unterbrechungen", "Interruptions", "Interruptions"];
  lngFailure = ["Fehler", "Failure", "Pannes"];
  lngFailure_modification = ["Grenzwerte", "Limits", "Pannes"];
  lngPowerLimiting = ["Leistungsbegrenzung"];
  lngType = ["Typ"];
  lngDesc = ["Beschreibung"];
  lngMisc = ["Sonstige Einrichtungen"];
  lngFileError = ["Ung\xFCltiges Dateiformat"];
  lngCfrmCopy = ["M\xF6chten Sie die angegebenen Zeiten \xFCbernehmen?"];
  lngAvailable = ["Verf\xFCgbar"];
  lngCPDYear = ["Jahresarbeitszahl"];
  lngHeatpump = ["W\xE4rmepumpe", "Heatpump"];
  lngHeatSrc = ["W\xE4rmequelle"];
  lngHeating = ["Heizung"];
  lngCluster = ["Cluster"];
  lngCycle = ["K\xE4ltekreis", "Cooling circuit", "Circuit frigorifique"];
  lngInfo1 = [
    "\xDCbersicht \xFCber die W\xE4rmepumpe/K\xE4ltekreis",
    "Overview of heat pump/cooling circuit",
    "Vue d'ensemble de la PAC/Circuit frigorifique"
  ];
  lngInfo2 = ["zum K\xE4ltekreis", "To cooling circuit", "Circuit frigorifique"];
  lngServices = ["Dienste", "Services"];
  lngChoose = ["Bitte ausw\xE4hlen", "Please select"];
  lngService = ["Servicedaten"];
  lngEvaporator = ["Verdampfereintritts-Regelung"];
  lngPIDEvaporator = [];
  lngCondenser = ["Kondensatoreintritts-Regelung"];
  lngPIDCondenser = [];
  lngEnergyDock = ["Leistungsbegrenzung f\xFCr EnergyDock"];
  lngMessages = ["Meldungen"];
  lngSolarRegen = ["Sonden Regenerierung"];
  lngExtH = ["Externer W\xE4rmeerzeuger"];
  lngSysData = ["Anlagendaten"];
  lngConfirmation = ["Quittieren"];
  lngPump = ["Pumpen"];
  lngMix = ["Mischerkreis"];
  lngTabMix = ["Mischerkreis"];
  lngStor = ["Speicherentladepumpe"];
  lngPV = ["Photovoltaik", "PV", "Photovolta\xEFque"];
  lngPVChange = ["\xE4nderung", "Change", "Changement"];
  lngPVDesc = ["Temperatur\xE4nderung ... w\xE4hrend PV-Ertrag"];
  lngComm = ["Kommunikation"];
  lngIO = ["Ein- und Ausg\xE4nge"];
  lngInput = ["Eing\xE4nge"];
  lngDI = ["Digitaleing\xE4nge"];
  lngOutput = ["Ausg\xE4nge"];
  lngValve = ["Ventile"];
  lngEEV = ["EEV"];
  lngRMH = ["RMH"];
  lngComp = ["Verdichter"];
  lngUser = ["Benutzer"];
  lngActivated = ["Aktiviert"];
  lngIntern = ["Intern"];
  lngBMS = ["BMS Karte"];
  lngSensor = ["Sensoren"];
  lngPressure = ["Drucktransmitter"];
  lngConfig = ["Konfiguration"];
  lngDefault = ["Standard", "Default"];
  lngDefaults = ["Werksdaten"];
  lngBasics = ["Grundeinstellungen"];
  lngOpPoint = ["Betriebspunkt"];
  lngMode = ["Betriebsmodus", "Operation Mode"];
  lngOpMode = this.lngMode;
  lngStatus = ["Status"];
  lngDefrost = ["Abtauung"];
  lngVent = ["Ventilator"];
  lngOilReturn = ["Verdichter - \xD6lr\xFCckf\xFChrung"];
  lngFREMAR = ["Verdichter - FREMAR (Frequenz Management zur Vermeidung von Resonanzen)"];
  lngReset = ["Reset"];
  lngExV = ["ExV/EVI"];
  lngScreed = ["Estrichprogramm"];
  lngStage2 = ["Stufe 2"];
  lngEInstall = ["Elektroinstallation"];
  lngProof = ["Druckprobe/ Evakuierung/ F\xFCllmenge"];
  lngCModul = ["K\xE4ltemodul"];
  lngFax = ["Fax"];
  lngExport = ["Backup/Restore", "Backup/Restore"];
  lngBackup = ["Backup/Restore", "Backup/Restore"];
  lngConnect = ["Verbindungsdaten"];
  lngPlay = ["Verbindung wird hergestellt"];
  lngDisconnect = ["Verbindung wird beendet"];
  lngServer = ["Servereinstellungen"];
  lngSelectFile = ["Bitte w\xE4hlen Sie eine Datei aus"];
  lngCompOut = ["Verdichter Ausgang"];
  lngCompMan = ["Manuelle Ansteuerung"];
  lngT24h = ["Temperaturverlauf"];
  lngT24hsub = ["der letzten 24 Stunden"];
  lngNominal = ["Soll"];
  lngActual = ["Ist"];
  lngGSI = ["GSI: Geo-Solar-Ice"];
  lngSolarAbsorber = ["Solar-Absorber"];
  lngGSIAbsorber = ["Geo-Ice-Absorber"];
  lngCounter = ["Z\xE4hlerst\xE4nde"];
  lngView = ["Ansicht", "View"];
  lngPID = ["PID-Regler"];
  lngAuto = ["Auto", "Auto", "Auto"];
  lngManual = ["Manuell", "Manual", "Manuel"];
  lngHand = ["Hand"];
  lngOn = ["An", "On"];
  lngOff = ["Aus", "Off", "OFF"];
  lngAll = ["Alle", "All", "Tous"];
  lngDay = ["Tag", "Day", "Jour"];
  lngNone = ["Kein", "None", "Aucun"];
  lngOpen = ["Auf"];
  lngClosed = ["Zu"];
  lngMin = ["Min"];
  lngMax = ["Max"];
  lngTotal = ["Gesamt", "Total", "Total"];
  lngPower = ["Leistung", "Power", "Puissance"];
  lngMinPower = ["Min. Leistung", "Min. power", "Puissance min."];
  lngMaxPower = ["Max. Leistung", "Max. Power", "Puissance max."];
  lngAutoExt = ["Automatisch + Ext.", "Automatique + ext."];
  lngTVBMS = ["Sollwert BMS", "Consigne BMS", "Tavoite-arvo BMS"];
  lngTargetValue = ["Sollwert", "Target value", "Consigne"];
  lngWeather = ["Witterungsgef\xFChrt", "Temp\xE9rature ext\xE9rieure"];
  lngConfirm = ["Best\xE4tigen", "OK", "Confirmer"];
  lngLogin = ["PIN", "PIN"];
  lngNewValues = ["Neue Werte", "New Values"];
  lngTOutdoor = ["T Au\xDFen"];
  lngStandby = ["Standby"];
  lngESCLock = ["EVU Sperre"];
  lngWait = ["Warten"];
  lngModal_Change = ["\xC4nderungen wurden gespeichert!"];
  lngModal_AddClient = ["Kundendaten wurden hinzugef\xFCgt!"];
  lngModal_User = ["Bitte tragen Sie zuerst einen neuen Kunden ein!"];
  lngModal_Run = ["Testlauf"];
  lngModal_Save = ["gespeichert"];
  lngModal_Empty = ["Keine gespeicherten Daten"];
  lngSave = ["Daten werden gespeichert"];
  lngLevel0 = ["Betreiberebene"];
  lngLevel1 = ["Serviceebene"];
  lngLevel2 = ["Werksberechtigung"];
  lngLevel3 = ["Entwicklerebene"];
  lngh318B = ["K\xFChlen EXV - Abtauvorgang"];
  lngPINErr = ["PIN ist leider ung\xFCltig"];
  lngDLog01 = [""];
  lngDLog02 = [
    "(*)Um die Datenaufzeichnung anzuhalten muss das WEBInterface neu gestartet werden.",
    "(*)To stop data recording, the WEB interface must be restarted.",
    "(*)Afin d'arr\xEAter l'enregistrement des donn\xE9es l'interface WEB devra \xEAtre redemarr\xE9e."
  ];
  lngDLog03 = [
    "Intervall f\xFCr Datenaufzeichnung",
    "Interval for data recording",
    "Intervalle d'enregistrement des donn\xE9es"
  ];
  lngDLog04 = ["Datenkompression", "Data compression", "Compression des donn\xE9es"];
  lngDLog05 = ["Werte \xFCber E-Mail versenden", "Send values via e-mail", "Envoyer les valeurs par E-Mail"];
  lngDLog06 = ["Betreff", "Reference", "Objet"];
  lngDLog07 = [
    "Datenaufzeichnung jetzt aktualisieren",
    "Update data recording now",
    "Actualiser l'enregistrement des donn\xE9es"
  ];
  lngDLog08 = [
    "Gruppe 1 - Linke Achsenbezeichnung",
    "Group 1 - left axis designation",
    "Groupe 1 - Description de l'axe de gauche"
  ];
  lngDLog09 = ["Y-Achse Skalierung", "Y-axis scaling", "Graduation de l'axe Y"];
  lngDLog10 = ["Low range limit", "Low range limit", "Low range limit"];
  lngDLog11 = ["High range limit", "High range limit", "High range limit"];
  lngDLog12 = [
    "Gruppe 2 - Rechte Achsenbezeichnung",
    "Group 2 - right axis designation",
    "Groupe 2 - Description de l'axe de droite"
  ];
  lngDLog13 = ["Y-Achse Skalierung", "Y-axis scaling", "Graduation de l'axe Y"];
  lngDLog14 = ["Low range limit", "Low range limit", "Low range limit"];
  lngDLog15 = ["High range limit", "High range limit", "High range limit"];
  lngDLog16 = ["Gruppe 3 - Digitale Variablen", "Group 3 - digital variable", "Groupe 3 - Variables num\xE9riques"];
  lngDLog17 = ["\xE4nderungen \xFCbernehmen", "Accept changes", "Accepter les changement"];
  lngThDLog02 = ["Name", "Name", "Nom"];
  lngThDLog03 = ["Datentyp", "Data type", "Type de donn\xE9es"];
  lngThDLog04 = ["Index", "Index", "Index"];
  lngThDLog05 = ["Bezeichnung", "Description", "Description"];
  lngThDLog06 = ["Gruppe", "Group", "Groupe"];
  lngThDLog07 = ["Farbe", "Colour", "Couleur"];
  lngNetwork01 = ["IP-Adresse", "IP address", "Adresse IP"];
  lngNetwork02 = [
    "Geben Sie die IP-Adresse an, unter der das WATERKOTTE!Web im lokalen Netzwerk erreichbar ist.",
    "Enter IP address under which the WATERKOTTE!Web can be accessed in the local network.",
    "Donnez l'adresse IP sous laquelle le WATERKOTTE!Web est joignable dans le r\xE9seau local."
  ];
  lngNetwork03 = [
    "IP-Adresse automatisch beziehen: DHCP",
    "Obtain IP address automatically: DHCP",
    "Prendre l'adresse IP automatiquement: DHCP"
  ];
  lngNetwork04 = ["Achtung!", "Caution!", "Attention!"];
  lngNetwork05 = [
    "\xE4nderungen auf dieser Seite k\xF6nnen dazu f\xFChren, dass die WATERKOTTE!Web nicht mehr erreichbar ist.",
    "Changes on this page may cause the WATERKOTTE!Web to become inaccessible.",
    "Des changements sur cette page, peuvent provoquer que le WATERKOTTE!Web ne soit plus joignable."
  ];
  lngNetwork06 = ["Subnetzmaske", "Subnet mask", "Masque de r\xE9seau"];
  lngNetwork07 = ["Standardgateway", "Standard gateway", "Passerelle standard"];
  lngNetwork08 = ["Bevorzugter DNS-Server", "Preferred DNS server", "Server DNS primaire"];
  lngNetwork09 = ["Alternativer DNS-Server", "Alternative DNS server", "Server DNS secondaire"];
  lngNetwork10 = ["\xE4nderungen \xFCbernehmen", "Accept changes", "Accepter les changements"];
  lngNetwork11 = ["E-Mail-Adresse", "E-mail address", "Adresse E-Mail"];
  lngNetwork12 = [
    "Bitte tragen Sie hier Ihre E-Mail-Adresse und Ihr dazugeh\xF6riges E-Mail-Kennwort ein.",
    "Please enter your e-mail address and corresponding e-mail password here.",
    "Veuillez donner votre adresse E-Mail et son mot de passe."
  ];
  lngNetwork13 = ["Kennwort", "Password", "Mot de passe"];
  lngNetwork14 = [
    "Bitte erg\xE4nzen Sie die Zugangsdaten Ihres E-Mail-Kontos:",
    "Please complete access data of your e-mail account:",
    "Veuillez completer les donn\xE9es d'acc\xE9s de votre compte E-Mail:"
  ];
  lngNetwork15 = ["E-Mail-Benutzername", "E-mail user name", "Nom d'utilisateur E-Mail"];
  lngNetwork16 = [
    "Postausgang-Server (SMTP)",
    "Outgoing mail server (SMTP)",
    "Serveur pour transfert de courrier (SMTP)"
  ];
  lngNetwork17 = ["Absendername", "Sender name", "Nom de l'exp\xE9diteur"];
  lngNetwork18 = [
    "Die E-Mail wird mit dem Absendernamen WATERKOTTE!Web versendet. Wenn Sie einen anderen Absendernamen festlegen m\xF6chten, geben Sie ihn hier ein.",
    "The e-mail is sent under the sender name WATERKOTTE!Web. If you would like to specify another sender name, please enter it here.",
    "Le mail est envoy\xE9 sous le nom de l'exp\xE9diteur WATERKOTTE!Web. Si vous souhaitez sp\xE9cifier un autre nom d'exp\xE9diteur, veuillez le l'indiquer ici."
  ];
  lngNetwork19 = ["Antwort an", "Answer to", "R\xE9pondre \xE0"];
  lngNetwork20 = [
    "An diese E-Mail-Adresse senden:",
    "Send to this e-mail address:",
    "Envoyer \xE0 cette adresse E-Mail"
  ];
  lngNetwork21 = ["Weitere E-Mail-Adressen:", "Additional e-mail addresses:", "Autres adresses E-Mail:"];
  lngNetwork22 = ["\xE4nderungen \xFCbernehmen", "Accept changes", "Accepter les changements"];
  lngReport = ["Servicebericht"];
  lngReport_Data = ["Gespeicherte Berichte"];
  lngReport_Clients = ["Kundendaten"];
  lngReport_IQE = ["Inspektionsbericht (QE)"];
  lngReport_SQE = ["Servicebericht (QE)"];
  lngReport_WQE = ["Wartungsprotokoll (QE)"];
  lngReport_PQE = ["Pr\xFCfinspektion (W\xE4rmequelle Geothermie)"];
  lngReport_SQL = ["Servicebericht (QL)"];
  lngReport_SRMH = ["Servicebericht (RMH)"];
  lngReport_FS = ["Checkliste Fachservice"];
  lngReport_IB = ["Inspektionsbericht"];
  lngReport_AQE = [
    "Inbetriebnahmeprotokoll (QE)",
    "Acceptance and Installation Data",
    "Donn\xE9es de la mise en service"
  ];
  lngReport_AQL = ["Inbetriebnahmeprotokoll (QL)"];
  lngReport_ARMH = ["Inbetriebnahmeprotokoll (RMH)"];
  lngReport_ABL = ["Inbetriebnahmeprotokoll (BasicLineGeo)"];
  lngAcceptance = ["Abnahme", "Acceptance"];
  lngInstData = ["Anlagendaten Reglereinstellungen"];
  lngServicesA = ["verf\xFCgbare Dienste", "Available Services"];
  lngR1 = ["Anlagenerrichter"];
  lngR2 = ["Auftraggeber"];
  lngR3 = ["Kunde"];
  lngR4 = ["Name"];
  lngR5 = ["Stra\xDFe"];
  lngR6 = ["PLZ"];
  lngR7 = ["Ort"];
  lngR8 = ["Tel-Nr."];
  lngR9 = ["N\xE4here Angaben (Ausfallmeldungen)"];
  lngR10 = ["Anlagedaten W\xE4rmequelle"];
  lngR11 = ["Grundwasser"];
  lngR12 = ["Str\xF6mungs\xFCberwachung"];
  lngR13 = ["m<sup>3</sup>/h"];
  lngR14 = ["Erdreich/Glykol"];
  lngR15 = ["Sonde vertikal"];
  lngR16 = ["Erdabsorber horizontal"];
  lngR17 = ["Reprosol"];
  lngR18 = ["Glykolbezeichnung"];
  lngR19 = ["Stockpunkt"];
  lngR20 = ["Sonstige W\xE4rmequelle"];
  lngR21 = ["Anlagedaten W\xE4rmenutzung"];
  lngR22 = ["Fu\xDFbodenheizung"];
  lngR23 = ["System Waterkotte"];
  lngR24 = ["Fremdsystem"];
  lngR25 = ["Radiatoren"];
  lngR26 = ["NTV-Konvektoren"];
  lngR27 = ["Sonstiges"];
  lngR28 = ["Brauchwassererw\xE4rmung"];
  lngR29 = ["Ladespeicher"];
  lngR30 = ["Liter"];
  lngR31 = ["W\xE4rmetauscher extern"];
  lngR32 = ["W\xE4rmetauscher intern"];
  lngR33 = ["Durchlaufwassererw\xE4rmer"];
  lngR34 = ["Bemerkungen"];
  lngR35 = ["Fahrtkilometer anteilig (km)"];
  lngR36 = ["Fahrzeit anteilig (h)"];
  lngR37 = ["Ankunft"];
  lngR38 = ["Abreise"];
  lngR39 = ["Monteurstunden"];
  lngR40 = ["Bericht"];
  lngR140 = ["Materialeinsatz"];
  lngR41 = ["Monteur"];
  lngR42 = ["Unterschrift"];
  lngR43 = ["Anlagenbetreiber", "Installation Operator"];
  lngR44 = ["E-Mail", "E-Mail", "E-Mail"];
  lngR45 = ["Vertr\xE4ge"];
  lngR46 = ["LongLife Wartung (j\xE4hrl. Vor-Ort-Wartung)"];
  lngR47 = ["Servicevertragsnummer"];
  lngR48 = ["RemoteCare Service (Fernwartung)"];
  lngR49 = ["Fernwartungsvertragsnummer"];
  lngR51 = ["Die Anlage ist in Benutzung seit"];
  lngR52 = ["Die Anlage wurde m\xE4ngelfrei abgenommen"];
  lngR53 = ["Die Anlage wurde abgenommen mit dem Vorbehalt der Beseitigung nebenstehender M\xE4ngel:"];
  lngR54 = [
    'Die Anlage wurde wegen nebenstehender M\xE4ngel <span class="text-danger"><strong>nicht</strong></span> in Betrieb gesetzt und abgenommen.'
  ];
  lngR54_1 = [
    "<small><strong>Hinweis:</strong> Hat der Betreiber die Leistung in Benutzung genommen, so gilt die Abnahme nach Ablauf von 6 Werktagen nach Beginn der Benutzung als erfolgt. (\xA712, Abs.5, VOB, Teil B)</small>"
  ];
  lngR55 = ["Die Anlage wurde durch den nebenstehenden autorisierten Kundendienst in Betrieb genommen"];
  lngR56 = ["\xDCbergabe der Bedienungsanleitung ist erfolgt"];
  lngR57 = ["Einweisung in die Bedienung des Reglers ist erfolgt"];
  lngR58 = [
    "Die Anlage wurde gem\xE4\xDF der Planungs-/ Installationsanleitung von WATERKOTTE in Benutzung genommen"
  ];
  lngR59 = [
    "Der Betreiber wurde in die Anlage eingeweisen. Es lag eine entsprechende Bedien-/Montage-/Installationsanleitung vor"
  ];
  lngR62 = ["Zwischen Anlagenerrichter und Anlagenbetreiber besteht ein Werksvertrag nach: "];
  lngR63 = ["VOB, Teil B"];
  lngR64 = ["BGB"];
  lngR66 = ["Wasser-Frostschutz-Gemisch"];
  lngR67 = ["Trennw\xE4rmetauscher"];
  lngR68 = ["Sondenl\xE4nge ges."];
  lngR69 = ["Absorberfl\xE4che"];
  lngR70 = ["Artikel-Nr."];
  lngR75 = ["K\xE4ltemittelf\xFCllung optimiert"];
  lngR76 = ["nachgef\xFCllt"];
  lngR77 = ["abgelassen"];
  lngR78 = [];
  lngR79 = ["Kompressor"];
  lngR80 = ["\xDCberpru\u0308fung der W\xE4rmequellenanlage"];
  lngR81 = ["Visuelle Pru\u0308fung auf mechanische Besch\xE4digung an zug\xE4nglichen Anlagenbauteilen"];
  lngR82 = ["Kontrolle der l\xF6sbaren Verbindungen auf Festigkeit und Dichtigkeit"];
  lngR83 = ["Temperatur- und Druckmessungen gem\xE4\xDF Messprotokoll"];
  lngR84 = ["Bei Wasser-/Glykolgemisch Stockpunkt messen"];
  lngR85 = ["\xDCberpru\u0308fung der W\xE4rmenutzung"];
  lngR86 = ["Kontrolle der l\xF6sbaren Verbindungen"];
  lngR87 = ["F\xFClldruck pr\xFCfen"];
  lngR88 = ["Temperatur- und Druckmessungen gem\xE4\xDF Messprotokoll"];
  lngR89 = ["\xDCberpru\u0308fung W\xE4rmepumpenkreislauf"];
  lngR90 = ["Visuelle Pru\u0308fung K\xE4ltemittelmenge (Schauglas)"];
  lngR91 = ["Sicherheitssystem pru\u0308fen"];
  lngR92 = ["Kontrolle aller l\xF6sbaren Verbindungen auf Festigkeit und Dichtigkeit"];
  lngR93 = ["Flexible Anschlu\u0308sse und Befestigungen pru\u0308fen"];
  lngR94 = ["Stromaufnahme des Kompressors messen und protokollieren"];
  lngR95 = ["Temperatur- und Druckmessungen Messprotokoll"];
  lngR96 = ["Reglereinstellung pru\u0308fen"];
  lngR97 = ["Bericht und Auswertung"];
  lngR98 = ["Erstellen eines Messprotokolls fu\u0308r die W\xE4rmepumpe"];
  lngR99 = [
    "Bewertung der Anlage aufgrund der aufgenommenen Messungen, Plausibilit\xE4tspru\u0308fung der Messwerte"
  ];
  lngR100 = ["Aufstellung des Au\xDFenger\xE4tes (zutreffendes ausw\xE4hlen)"];
  lngR101 = ["Verbindungsl\xE4nge: Innen- / Au\xDFenger\xE4t"];
  lngR102 = ["H\xF6hendifferenz: Innen- / Au\xDFenger\xE4t"];
  lngR103 = ["Voreinstellung der DIP-Schalter am Innenger\xE4t gepr\xFCft (siehe Installationsanleitung)"];
  lngR104 = ["Anschlu&szlig; des Neutralleiters vor Inbetriebnahme messtechnisch gepr\xFCft"];
  lngR105 = ["Druckprobe durchgef\xFChrt bei"];
  lngR106 = ["bei"];
  lngR107 = ["Dauer"];
  lngR108 = ["Dauer der Evakuierung"];
  lngR109 = ["Anlage ist nach dem Stand der Technik elektrisch sicher angeschlossen"];
  lngR110 = ["Model (Au&szlig;enger\xE4t)"];
  lngR111 = ["Service Ref. Nr. (Au&szlig;enger\xE4t)"];
  lngR112 = ["Serien-Nr. (Au&szlig;enger\xE4t)"];
  lngR113 = ["Art der K\xE4ltemittelleitungsverbindung"];
  lngR114 = ["gel\xF6tet"];
  lngR115 = ["gepresst"];
  lngR116 = ["EVU-Sperre vorhanden"];
  lngR117 = ["Evakuierung durchgef\xFChrt bei"];
  lngR118 = ["Elektroanschl\xFCsse auf richtigen Sitz und Festigkeit gepr\xFCft"];
  lngR127 = ["F\xFCllmenge Wasser-Glykol"];
  lngR120 = ["Evakuierung der Verbindungsleitungen (Au\xDFenger\xE4t zur W\xE4rmeverteilstation)"];
  lngR121 = ["Au\xDFentemperatur"];
  lngR122 = ["Dampfdruck (Wasser/Eis)"];
  lngR123 = ["Vakuumdauer"];
  lngR124 = ["separater Heizungsspeicher"];
  lngR125 = ["separater Warmwasserspeicher"];
  lngR126 = ["Informationen zum K\xE4ltekreis"];
  lngR130 = ["Innenteil"];
  lngR131 = [];
  lngR132 = ["Pufferspeicher Heizung"];
  lngR141 = ["Druck"];
  lngR142 = ["Durchfluss"];
  lngR143 = ["Druck"];
  lngR144 = ["Durchfluss"];
  lngR145 = [];
  lngR151 = ["EcoPack", "EcoPack", "EcoPack"];
  lngR152 = ["EcoWell", "EcoWell", "EcoWell"];
  lngR153 = ["kW", "kW", "kW"];
  lngR154 = ["Liter"];
  lngR155 = ["Brauchwasserspeicher"];
  lngR160 = ["Datum der Abnahme"];
  lngR190 = ["Analyse Heizungswasser"];
  lngR191 = ["Elektrischer Leitwert IST/SOLL"];
  lngR192 = ["pH-Wert IST/SOLL"];
  lngR200 = ["Druck und Dichtheitskontrolle im HZG- und Solekreislauf kontrolliert und ggf. aufgefu\u0308llt"];
  lngR201 = ["Frostschutzkonzentration gemessen"];
  lngR202 = ["Sole Temperaturen/Spreizung u\u0308berpru\u0308ft"];
  lngR203 = ["Heizungstemperaturen/Spreizung u\u0308berpru\u0308ft"];
  lngR204 = ["Fu\u0308hlerwerte und Einstellungen der Regelung u\u0308berpru\u0308ft und ggf. nachgeregelt"];
  lngR205 = ["Fehlerspeicher ausgelesen"];
  lngR206 = ["ND / HD Abschaltung und Sicherheitssystem gepru\u0308ft"];
  lngR207 = ["K\xE4ltemittelverlust mit Lecksuchger\xE4t kontrolliert"];
  lngR208 = ["K\xE4ltemittelmenge u\u0308ber Schauglas kontrolliert"];
  lngR209 = ["\xD6lmenge im Kompressorschauglas gepru\u0308ft"];
  lngR210 = ["Kompressortemperaturen gepru\u0308ft"];
  lngR211 = ["Dru\u0308cke im Verdampfer und Kondensator gepru\u0308ft und mit Regelung verglichen"];
  lngR212 = ["Verschraubungen im K\xE4ltekreis gepru\u0308ft"];
  lngR213 = ["Elektroanschlu\u0308sse auf festen Sitz kontrolliert (auch FU)"];
  lngR214 = ["Sicherheitsventil Warmwasser"];
  lngR215 = ["Sicherheitsventil Heizung"];
  lngR216 = ["Druck Kaltwasser"];
  lngR217 = ["Ausdehnungsgef\xE4\xDF Warmwasser"];
  lngR218 = ["Ausdehnungsgef\xE4\xDF Heizung"];
  lngR219 = ["Ausdehnungsgef\xE4\xDF Quelle"];
  lngR220 = ["Long Life Servicevertrag"];
  lngR221 = ["Wartungsvertragskennziffer"];
  lngR222 = ["Artikelnummer"];
  lngR223 = ["Die Voraussetzungen der Herstellergarantie wurden erf\xFCllt"];
  lngR224 = ["Garantielaufzeit bis (Datum)"];
  lngR225 = ["F\xE4lligkeit der n\xE4chsten Wartung (Datum)"];
  lngR226 = ["Rohrleitungdimensionen"];
  lngR227 = ["W\xE4rmepumpe von WQ-System absperrbar"];
  lngR228 = ["Neutralleiteranschluss auf korrekte Verdrahtung gepr\xFCft"];
  lngR229 = ["Rohrleitungdimensionen"];
  lngR230 = ["Druckminderer Warmwasser"];
  lngR231 = ["W\xE4rmepumpe von Heiz-System absperrbar"];
  lngR232 = ["Warmwasserspeicher verschraubt und absperrbar"];
  lngR233 = ["Elektrischer Arbeitsz\xE4hler NT"];
  lngR234 = ["Elektrischer Arbeitsz\xE4hler HT"];
  lngR235 = ["W\xE4rmemengenz\xE4hler"];
  lngR236 = ["Pr\xFCfung: K\xE4ltekreis nach Chemikalien-Klimaschutzverordnung"];
  lngR237 = ["Fotos wurden erstellt"];
  lngR238 = [""];
  lngR239 = [""];
  lngR240 = [""];
  lngR250 = ["Protokoll-Nummer"];
  lngR251 = ["Datum IBN"];
  lngR252 = ["Datum Lieferung"];
  lngR253 = ["Wartungsvertrag-Kennnummer"];
  lngR254 = ["Datum Wartung"];
  lngR255 = ["Wartung"];
  lngR256_1 = ["Sole/Wasser"];
  lngR256_2 = ["Wasser/Wasser"];
  lngR257 = ["Zubeh\xF6rkomponenten"];
  lngR258 = ["EcoStock"];
  lngR259 = ["EcoPack"];
  lngR260 = [""];
  lngR261 = [""];
  lngR300 = ["1. Sichtpru\u0308fung der Ger\xE4te- und Zubeh\xF6rkomponenten"];
  lngR301 = ["Besch\xE4digung"];
  lngR302 = ["Korrosion"];
  lngR303 = ["Verschmutzung"];
  lngR304 = ["Befestigung"];
  lngR305 = ["Leckagen"];
  lngR306 = ["\xD6laustritt und \xD6lspuren"];
  lngR307 = ["2. Pru\u0308fung W\xE4rmequellenkreislauf"];
  lngR308 = ["Pru\u0308fung Systemdruck der W\xE4rmequelle"];
  lngR309 = ["Pru\u0308fung Ausdehnungsgef\xE4\xDF im W\xE4rmequellenkreislauf (Vordruck/Fu\u0308llstand)"];
  lngR310 = ["Pru\u0308fung und Reinigung Schmutzfilter (Filtersieb) im W\xE4rmequelleneintritt"];
  lngR311 = ["Pru\u0308fung Frostschutzkonzentration im W\xE4rmequellenkreislauf"];
  lngR312 = ["Sichtpru\u0308fung des Sicherheitsventils im W\xE4rmequellensystem"];
  lngR313 = ["Funktionspru\u0308fung Hydraulikkomponenten im W\xE4rmequellensystem (Pumpen, Mischer, Ventile)"];
  lngR314 = ["Sichtpru\u0308fung des W\xE4rmequellensystems auf Dichtheit, Besch\xE4digung und Kondensatbildung"];
  lngR315 = ["Messung des pH-Wertes des W\xE4rmequellenmediums"];
  lngR316 = ["Messung der Leitf\xE4higkeit des W\xE4rmequellenmediums"];
  lngR317 = ["2a. Zusatzpru\u0308fung W\xE4rmequellenkreislauf bei Wasser-/Wasser-W\xE4rmepumpe"];
  lngR318 = ["Pru\u0308fung und Reinigung Schmutzfilter (Filtersieb) in der Brunnenleitung"];
  lngR319 = ["Temperaturcheck des Trennw\xE4rmetauscher (\u0394T Quelle: 3 bis 4 K)"];
  lngR320 = ["Ablesen des Durchflusses an der Durchfl ussmengenu\u0308berwachung"];
  lngR321 = ["Sichtpru\u0308fung der W\xE4rmed\xE4mmung auf Besch\xE4digungen und Kondensatbildung"];
  lngR322 = ["3. Pru\u0308fung Heizungskreis"];
  lngR323 = ["Pru\u0308fung Systemdruck des Heizungskreislaufs"];
  lngR324 = ["Pru\u0308fung Ausdehnungsgef\xE4\xDF im Heizungskreislauf (Vordruck/Fu\u0308llstand)"];
  lngR325 = ["Pru\u0308fung und Reinigung Schmutzfilter (Filtersieb) im Heizungskreislauf"];
  lngR326 = ["Sichtpru\u0308fung des Sicherheitsventils im Heizungssystem"];
  lngR327 = ["Funktionspru\u0308fung Hydraulikkomponenten im Heizungssystem (Pumpen, Mischer, Ventile)"];
  lngR328 = ["Pru\u0308fung E-Heizstab (Kundeninformation: Betriebsstunden)"];
  lngR329 = ["Sichtpru\u0308fung des Heizungssystems auf Dichtheit und Besch\xE4digung der W\xE4rmed\xE4mmung"];
  lngR330 = ["Messung des pH-Wertes des Heizungswassers (nach VDI-Richtlinie 2035)"];
  lngR331 = ["Messung der Leitf\xE4higkeit des Heizungswassers (nach VDI-Richtlinie 2035)"];
  lngR332 = ["4. Pru\u0308fung Warmwasserbereitung"];
  lngR333 = ["Sichtpru\u0308fung bei Warmwasserbereiter und wasserfu\u0308hrenden Verbindungen auf Dichtheit"];
  lngR334 = ["Sichtkontrolle des Druckminderers"];
  lngR335 = ["Pru\u0308fung Montage und Absicherung des Sicherheitsventils Warmwasser"];
  lngR336 = ["Pru\u0308fung Membranausdehnungsgef\xE4\xDF Warmwasser (Vordruck)"];
  lngR337 = ["Pru\u0308fung Funktion Umschaltung und Umschaltventil"];
  lngR338 = ["Pru\u0308fung Funktion und ggf. Einstellung der Pumpen"];
  lngR339 = ["5. Pru\u0308fung K\xE4ltekreis"];
  lngR340 = ["Sichtpru\u0308fung K\xE4ltekreislauf auf Besch\xE4digungen, \xD6laustritt, Korrosion"];
  lngR341 = ["\xDCberpru\u0308fung l\xF6sbarer Verbindungen auf festen Sitz"];
  lngR342 = ["Dichtheitspru\u0308fung gem\xE4\xDF Verordnung (EU) Nr. 517/2014"];
  lngR343 = ["Probelauf mit \xDCberpru\u0308fung aller Messwerte"];
  lngR344 = ["\xDCberpru\u0308fung der Betriebstemperaturen (siehe hierzu 10. Dokumentation)"];
  lngR345 = ["\xDCberpru\u0308fung der Ger\xE4teeffizienz"];
  lngR346 = ["Sichtpru\u0308fung K\xE4ltemittelschauglas und \xD6lschauglas"];
  lngR347 = ["Pru\u0308fung Funktion der Sicherheitseinrichtungen inkl. HD und ND Abschaltung"];
  lngR348 = ["6. Pru\u0308fung Elektrik"];
  lngR349 = ["Sichtkontrolle der elektrischen Komponenten"];
  lngR350 = ["Kontrolle Elektroanschlu\u0308sse auf festen Sitz"];
  lngR351 = ["Nachziehen Anschlussklemmen"];
  lngR352 = ["Messung Stromaufnahme und Netzspannung pro Phase"];
  lngR353 = ["7. Pru\u0308fung Regler und Steuerung"];
  lngR354 = ["Sichtkontrolle der Reglerkomponenten"];
  lngR355 = ["Pru\u0308fung Einstell- und Fu\u0308hlerwerte des Reglers"];
  lngR356 = ["Kontrolllauf mit Wartungssoftware EasyCon"];
  lngR357 = ["Durchfu\u0308hrung Funktionskontrolle"];
  lngR358 = ["8. Pru\u0308fung Software (nur bei EcoTouch LongLife Wartung)"];
  lngR359 = ["Bewertung aktueller Stand Software"];
  lngR360 = ["Ggf. Durchfu\u0308hrung Software-Update"];
  lngR361 = ["9. Energetische Optimierung (nur bei ECoTouch LongLife Wartung)"];
  lngR362 = ["Ergebnisse aus COP-Counter dokumentieren und mit Vorjahreswerten vergleichen"];
  lngR363 = ["COP aktuell"];
  lngR364 = ["COP Vorjahr"];
  lngR365 = ["JAZ HZG aktuell"];
  lngR366 = ["JAZ HZG Vorjahr"];
  lngR367 = ["JAZ WW aktuell"];
  lngR368 = ["JAZ WW Vorjahr"];
  lngR369 = ["Fehlerspeicher auslesen und analysieren"];
  lngR370 = ["vermerkte Fehler (Code)"];
  lngR371 = ["Einstellung der Heizkennlinie pr\xFCfen und plausibilisieren"];
  lngR372 = ["Start Au\xDFentemperatur"];
  lngR373 = ["Einstellung der Warmwasserbereitung pr\xFCfen und ggf. optimieren"];
  lngR374 = ["10. Dokumentation"];
  lngR375 = [""];
  lngR376 = [""];
  lngR377 = [""];
  lngR378 = [""];
  lngR379 = [""];
  lngR380 = [""];
  lngRQL1 = ["T Druckgasleitung"];
  lngRQL2 = ["Stromaufnahme Verdichter"];
  lngThRep1 = ["T<sub>QE</sub>"];
  lngThRep2 = ["T<sub>QA</sub>"];
  lngThRep3 = ["T<sub>E</sub>"];
  lngThRep4 = ["T<sub>SL1</sub>"];
  lngThRep5 = ["T<sub>SL2</sub>"];
  lngThRep6 = ["p<sub>0</sub>"];
  lngThRep7 = ["T<sub>0, unten</sub>"];
  lngThRep8 = ["T<sub>0, oben</sub>"];
  lngThRep9 = ["I<sub>K</sub>"];
  lngThRep10 = ["p<sub>C</sub>"];
  lngThRep11 = ["T<sub>C, unten</sub>"];
  lngThRep12 = ["T<sub>C, oben</sub>"];
  lngThRep13 = ["T<sub>DL</sub>"];
  lngThRep14 = ["T<sub>FL</sub>"];
  lngThRep15 = ["T<sub>RL</sub>"];
  lngThRep16 = ["T<sub>VL</sub>"];
  lngA1 = ["Au\xDFentemperatur", "Ext. temperature", "Temp\xE9rature ext\xE9rieure"];
  lngA2 = ["Au\xDFentemperatur 1h", "Ext.temperature 1h", "Temp\xE9rature ext\xE9rieure 1h"];
  lngA3 = ["Au\xDFentemperatur 24h", "Ext.temperature 24h", "Temp\xE9rature ext\xE9rieure 24h"];
  lngA4 = ["T Quelle Ein", "T Source In", "T entr\xE9e captage"];
  lngA5 = ["T Quelle Aus", "T Source Out", "T sortie captage"];
  lngA6 = ["T Verdampfer", "T Evaporation", "T \xE9vaporation"];
  lngA7 = ["T Saugleitung", "T Suction line", "T gaz aspir\xE9"];
  lngA8 = ["p Verdampfer", "p Evaporation", "p \xE9vaporation"];
  lngA9 = [];
  lngA10 = ["T Sollwert"];
  lngA11 = ["T R\xFCcklauf", "T return", "T retour"];
  lngA699 = [this.lngA11[0] + " 1", this.lngA11[1] + " 1", this.lngA11[2] + " 1"];
  lngA700 = [this.lngA11[0] + " 2", this.lngA11[1] + " 2", this.lngA11[2] + " 2"];
  lngA701 = [this.lngA11[0] + " 3", this.lngA11[1] + " 3", this.lngA11[2] + " 3"];
  lngA702 = [this.lngA11[0] + " 4", this.lngA11[1] + " 4", this.lngA11[2] + " 4"];
  lngA12 = ["T Vorlauf", "T flow", "T d\xE9part"];
  lngA13 = ["T Kondensation", "T Condensation", "T condensation"];
  lngA14 = ["Tc Bubble-Point", "T Bubble Point"];
  lngA15 = ["p Kondensator", "p Condensation", "p condensation"];
  lngA16 = ["Temperatur Pufferspeicher"];
  lngA17 = ["Temperatur Raum", "Room temperature", "Temp\xE9rature pi\xE8ce pilote"];
  lngA18 = ["Temperatur Raum 1h"];
  lngA19 = ["Temperatur Warmwasser", "Actual temperature", "Temp\xE9rature actuelle"];
  lngA20 = ["Temperatur Pool", "Current temperature", "Temp\xE9rature actuelle"];
  lngA21 = ["Temperatur Solar"];
  lngA22 = ["Austrittstemperatur Solarkollektor"];
  lngA23 = ["EEV Ventil\xF6ffnung", "Expansion valve", "Ouverture d\xE9tendeur"];
  lngA24 = [];
  lngA25 = ["Elektrische Leistung", "Electrical energy", "Puissance \xE9lectrique"];
  lngA26 = ["Thermische Leistung", "Thermal energy", "Puissance thermique"];
  lngA27 = ["K\xE4lteleistung", "Cooling energy", "Puissance frigorifique"];
  lngA28 = ["COP", "COP", "COP"];
  lngA29 = ["COP K\xE4lteleistung", "COP cooling output", "EER"];
  lngA30 = ["aktuelle Temperatur", "Current temperature", "Temp\xE9rature actuelle"];
  lngA31 = ["geforderte Temperatur", "Required temperature", "Temp\xE9rature de consigne"];
  lngA32 = ["Heiztemperatur", "Heating temperature"];
  lngA33 = ["aktuelle Temperatur", "Current temperature", "Temp\xE9rature actuelle"];
  lngA34 = ["geforderte Temperatur", "Required temperature", "Temp\xE9rature de consigne"];
  lngA35 = [];
  lngA36 = [];
  lngA37 = ["geforderte Temperatur", "Required temperature", "Temp\xE9rature de consigne"];
  lngA38 = ["Sollwert", "Target value", "Consigne"];
  lngA39 = [];
  lngA40 = [
    "geforderte Temperatur (incl. Anhebung/Absenkung)",
    "Required temperature (incl. rise/drop)",
    "Temp\xE9rature de consigne (avec augmentation/baisse)"
  ];
  lngA41 = ["geforderte Temperatur", "Required temperature", "Temp\xE9rature de consigne"];
  lngA42 = ["aktuelle Temperatur Kollektor", "Current temperature collector", "Temp\xE9rature actuelle collecteur"];
  lngA43 = ["aktuelle Temperatur Vorlauf", "Current temperature flow", "Temp\xE9rature actuelle d\xE9part"];
  lngA44 = ["aktuelle Temperatur"];
  lngA45 = ["geforderte Temperatur"];
  lngA46 = [];
  lngA47 = [];
  lngA48 = [];
  lngA49 = [];
  lngA50 = [];
  lngA51 = ["Drehzahl Heizungsp.", "Speed flow pump", "Vitesse pompe chauffage"];
  lngA52 = ["Drehzahl Quellenp.", "Speed surce pump", "Vitesse pompe captage"];
  lngA53 = [];
  lngA54 = [];
  lngA55 = [];
  lngA56 = [];
  lngA57 = [];
  lngA58 = ["Leistung Verdichter", "Power compressor", "Puissance compresseur"];
  lngA59 = [];
  lngA60 = [];
  lngA61 = ["Schaltdifferenz Sollwert", "Target value switching difference", "Hyst\xE9r\xE9sis consigne"];
  lngA90 = ["T Au\xDFen \xD81h", "T External \xD81h", "T ext\xE9rieure \xD81h"];
  lngA91 = ["T Norm-Au\xDFen", "T outdoor norm", "T base-ext."];
  lngA92 = ["T Heizkreis Norm", "T heat norm", "T base-chauf.fage"];
  lngA93 = ["T Heizgrenze", "T out begin", "T encl. ext."];
  lngA94 = ["T Heizgrenze Soll", "T base setpoint", "T encl. chauffage"];
  lngA95 = ["Grenze f\xFCr Sollwert (Max.)"];
  lngA96 = ["Temperatur Soll", "Temp. calc.", "Temp. consigne"];
  lngA97 = [];
  lngA98 = ["Raumtemperatur 1h", "T room 1h", "T-pi\xE8ce 1h"];
  lngA99 = ["Aktueller Wert", "Current value"];
  lngA100 = ["Raumtemperatur Soll", "T room setpoint", "T-pi\xE8ce consigne"];
  lngA101 = ["Raumeinfluss", "Room influence", "Influence pi\xE8ce"];
  lngA102 = ["Kleinster Wert", "Lowest value"];
  lngA103 = ["Gr\xF6sster Wert", "Biggest value"];
  lngA104 = ["Grenze f\xFCr Sollwert (Min.)"];
  lngA105 = [];
  lngA106 = [];
  lngA107 = ["Schaltdifferenz Sollwert", "Hysteresis", "Hyst\xE9r\xE9sis Consigne"];
  lngA108 = ["T Au&szlig;en Einsatzgrenze", "T out begin", "T ext\xE9rieure limite d'application"];
  lngA109 = ["K\xFChltemperatur", "T Cooling", "T Rafraichissement"];
  lngA110 = ["Vorlauftemperatur-begrenzung"];
  lngA111 = [];
  lngA112 = [];
  lngA139 = ["Schaltdifferenz Sollwert", "Target value switching difference", "Hyst\xE9r\xE9sis consigne"];
  lngA168 = ["geforderte Temperatur", "Required temperature", "Temp\xE9rature de consigne"];
  lngA169 = [
    "Sollwert bei Solarbetrieb",
    "Hotwater setpoint for solar support, outside heating period",
    "Consigne ECS en mode solaire hors de la p\xE9riode de chauffage"
  ];
  lngA170 = ["R\xFCcklauftemperatur Anhebung/Absenkung bei Optimierung"];
  lngA171 = ["Leistungsbegrenzung Max. Ausgang"];
  lngA172 = ["Leistungsbegrenzung Min. Ausgang"];
  lngA173 = [];
  lngA174 = ["Schaltdifferenz Sollwert", "Target value switching difference", "Hyst\xE9r\xE9sis consigne"];
  lngA175 = [];
  lngA200 = [];
  lngA201 = [];
  lngA202 = [];
  lngA203 = ["Leistungsbegrenzung Max. Ausgang"];
  lngA204 = ["Leistungsbegrenzung Min. Ausgang"];
  lngA205 = [
    "Einschalttemperaturdifferenz",
    "Switch on temperature difference",
    "Diff\xE9rence de temp\xE9rature d'enclenchement"
  ];
  lngA206 = [
    "Ausschalttemperaturdifferenz",
    "Switch off temperature difference",
    "Diff\xE9rence de temp\xE9rature d'arr\xEAt"
  ];
  lngA207 = [
    "Maximale Kollektortemperatur",
    "Maximum collector temperature",
    "Temp\xE9rature maximale du collecteur"
  ];
  lngA208 = ["Schaltdifferenz Solar-Vorlauf", "Switching difference flow", "Hyst\xE9r\xE9sis d\xE9part"];
  lngA209 = ["geforderte Temperatur Vorlauf", "Required temperature flow", "Consigne d\xE9part"];
  lngA210 = [];
  lngA235 = [];
  lngA236 = [];
  lngA237 = [];
  lngA238 = [
    "Einschalttemperatur ext. W\xE4rmeerzeuger bei Unterschreitung der Quelleneintritts-T oder Au&szlig;en-T von"
  ];
  lngA239 = [
    "Umschalttemperatur ext. W\xE4rmeerzeuger bei Unterschreitung der Quelleneintritts-T oder Au&szlig;en-T von"
  ];
  lngA240 = ["Schaltdifferenz Bivalenzpunkt"];
  lngA241 = [];
  lngA242 = [];
  lngA243 = [];
  lngA244 = ["Schaltdifferenz"];
  lngA245 = [];
  lngA270 = [];
  lngA271 = [];
  lngA272 = [];
  lngA273 = [];
  lngA274 = ["T Norm-Au&szligen"];
  lngA275 = ["T Heizkreis Norm"];
  lngA276 = ["T Heizgrenze"];
  lngA277 = ["T Heizgrenze Soll"];
  lngA278 = ["Maximale Temperatur im Mischerkreis"];
  lngA279 = [];
  lngA280 = [];
  lngA281 = [];
  lngA282 = [];
  lngA283 = [];
  lngA284 = [];
  lngA285 = [];
  lngA286 = ["T Au&szlig;en Einsatzgrenze"];
  lngA287 = ["K\xFChltemperatur"];
  lngA288 = ["Minimale Temperatur im Mischerkreis"];
  lngA289 = [];
  lngA290 = ["Verst\xE4rkung K<sub>p</sub>"];
  lngA291 = ["Handstellwert"];
  lngA400 = [];
  lngA401 = [];
  lngA412 = ["aktuelle Temperatur"];
  lngA413 = ["Raumthermostat"];
  lngA414 = ["Schaltdifferenz Sollwert"];
  lngA415 = ["geforderte Temperatur"];
  lngA416 = [
    "Raumtemperatur Sollwert w\xE4hrend Abwesenheit",
    "Target value room temperature during absence",
    "Temp\xE9rature de pi\xE8ce pendant l'absence"
  ];
  lngA417 = [
    "Sollwertabsenkung Heizkreis w\xE4hrend Abwesenheit",
    "Target value drop cooling circuit during absence",
    "Baisse de temp\xE9rature circuit chauffage pendant l'absence"
  ];
  lngA418 = [];
  lngA419 = [];
  lngA420 = [];
  lngA421 = [];
  lngA422 = [];
  lngA423 = [];
  lngA424 = ["Elektrische Arbeit", "Electrical performance", "Travail \xE9lectrique"];
  lngA425 = [];
  lngA426 = [];
  lngA427 = [];
  lngA428 = [];
  lngA429 = [];
  lngA430 = [];
  lngA431 = [];
  lngA432 = ["Thermische Arbeit", "Thermal performance", "Travail thermique"];
  lngA433 = [];
  lngA434 = ["Arbeitszahl W%E4rmepumpe", "Performance factor heat pump", "COP PAC"];
  lngA435 = ["Arbeitszahl Gesamtsystem", "Performance factor total system", "COP syst\xE8me complet"];
  lngA436 = ["K\xE4ltearbeit", "Cooling performance", "Travail frigorifique"];
  lngA437 = [];
  lngA438 = ["Verdichter", "Compressor", "Compresseur"];
  lngA439 = ["W\xE4rmequellenpumpe", "Source pump", "Pompe de captage"];
  lngA440 = ["Heizstab", "Electrical heater", "R\xE9sistance \xE9lectrique"];
  lngA441 = ["Heizbetrieb", "Heating", "Chauffage"];
  lngA442 = ["Warmwasserbetrieb", "Hot water", "ECS"];
  lngA443 = ["Pool-Heizbetrieb", "Pool", "Piscine"];
  lngA444 = [];
  lngA445 = [];
  lngA446 = [];
  lngA447 = [];
  lngA448 = [];
  lngA449 = [];
  lngA450 = ["Elektrische Arbeit", "Electrical performance", "Travail \xE9lectrique"];
  lngA451 = [];
  lngA452 = [];
  lngA453 = [];
  lngA454 = [];
  lngA455 = [];
  lngA456 = [];
  lngA457 = [];
  lngA458 = ["Thermische Arbeit", "Thermal performance", "Travail thermique"];
  lngA459 = [];
  lngA460 = ["Arbeitszahl W\xE4rmepumpe", "Performance factor heat pump", "COP PAC"];
  lngA461 = ["Arbeitszahl Gesamtsystem", "Performance total system", "COP syst\xE8me complet"];
  lngA462 = ["K\xE4ltearbeit", "Cooling performance", "Travail frigorifique"];
  lngA463 = [];
  lngA464 = ["Verdichter", "Compressor", "Compresseur"];
  lngA465 = ["W\xE4rmequellenpumpe", "Heat source pump", "Pompe de captage"];
  lngA466 = ["Heizstab", "Heating rod", "R\xE9sistance \xE9lectrique"];
  lngA467 = ["Heizbetrieb", "Heating mode", "Mode chauffage"];
  lngA468 = ["Warmwasserbetrieb", "Domestic hot water mode", "Mode ECS"];
  lngA469 = ["Pool-Heizbetrieb", "Pool heating mode", "Mode piscine"];
  lngA470 = ["Regelung"];
  lngA470_1 = ["Temperatur Regelung"];
  lngA471 = ["Verst\xE4rkung K<sub>p</sub>"];
  lngA472 = ["Ist"];
  lngA473 = ["Soll"];
  lngA474 = ["Handstellwert"];
  lngA475 = ["Min. Drehzahl"];
  lngA476 = ["Max. Drehzahl"];
  lngA477 = ["Y Stellausgang"];
  lngA478 = ["&Delta;Y"];
  lngA479 = ["T W\xE4rmequelle"];
  lngA480 = [];
  lngA481 = ["Verst\xE4rkung K<sub>p</sub>"];
  lngA482 = ["Ist"];
  lngA483 = ["Soll"];
  lngA484 = ["Handstellwert"];
  lngA485 = ["Min. Drehzahl"];
  lngA486 = ["Max. Drehzahl"];
  lngA487 = ["Y"];
  lngA488 = ["&Delta;Y"];
  lngA489 = ["Verst\xE4rkung K<sub>p</sub>"];
  lngA490 = ["Max. Ausgang"];
  lngA491 = ["Min. Ausgang"];
  lngA492 = ["Soll"];
  lngA493 = ["Ist"];
  lngA494 = ["Y", "Y", "Y"];
  lngA495 = ["&Delta;Y", "&Delta;Y", "&Delta;Y"];
  lngA496 = ["Verst\xE4rkung K<sub>p</sub>"];
  lngA497 = ["Max. Ausgang"];
  lngA498 = ["Min. Ausgang"];
  lngA499 = ["Soll"];
  lngA500 = ["Ist"];
  lngA501 = ["Y"];
  lngA502 = ["&Delta;Y"];
  lngA503 = ["Verst\xE4rkung K<sub>p</sub>"];
  lngA504 = ["Max. Ausgang"];
  lngA505 = ["Min. Ausgang"];
  lngA506 = ["Soll"];
  lngA507 = ["Ist"];
  lngA508 = ["Y"];
  lngA509 = ["&Delta;Y"];
  lngA510 = ["Y"];
  lngA511 = ["&Delta;Y"];
  lngA512 = [];
  lngA513 = [];
  lngA514 = [];
  lngA515 = [];
  lngA516 = ["Verdichter", "Compressor", "Compresseur"];
  lngA517 = [];
  lngA518 = ["Au&szlig;eneinheit", "Outdoor unit", "Unit\xE9 ext\xE9rieure"];
  lngA519 = [];
  lngA520 = ["Vollbetriebsstunden", "Operating hours", "Heures d'activit\xE9"];
  lngA521 = [];
  lngA522 = ["Heizungspumpe", "Heat. pump", "Pompe chauffage"];
  lngA523 = [];
  lngA524 = ["Quellenpumpe", "Source pump", "Pompe captage"];
  lngA525 = [];
  lngA526 = ["Solarkreispumpe", "Solar pump", "Solaire"];
  lngA527 = [];
  lngA528 = ["ext. W\xE4rmeerzeuger", "Ext. Heating", "Chauffage externe"];
  lngA529 = [];
  lngA530 = ["Heizbetrieb", "Heating", "Chauffage"];
  lngA531 = [];
  lngA532 = ["K\xFChlbetrieb", "Cooling", "Rafraichissement"];
  lngA533 = [];
  lngA534 = ["Warmwasserbetrieb", "Hot water", "ECS"];
  lngA535 = [];
  lngA536 = ["Pool-Heizbetrieb", "Pool ", "Piscine"];
  lngA537 = [];
  lngA538 = ["Solarbetrieb", "Solar", "Solaire"];
  lngA539 = [];
  lngA540 = ["Funktionsheizbetrieb", "F.heating", "Chauffage chape"];
  lngA541 = [];
  lngA542 = ["Abtauvorgang", "Defrost", "D\xE9givrage"];
  lngA543 = [];
  lngA544 = ["Bivalent parallel", "Bivalent parallel", "Bivalent Parall\xE8le"];
  lngA545 = [];
  lngA546 = ["Bivalent alternativ", "Bivalent alternative", "Bivalent Alternatif"];
  lngA547 = [];
  lngA548 = ["Photovoltaik", "Photovolta\xEFque"];
  lngA576 = ["PV-Ertrag", "PV operation", "Production PV"];
  lngA577 = this.lngA1;
  lngA578 = this.lngA2;
  lngA579 = this.lngA3;
  lngA580 = this.lngA4;
  lngA581 = this.lngA5;
  lngA582 = this.lngA6;
  lngA583 = this.lngA7;
  lngA584 = this.lngA8;
  lngA585 = this.lngA10;
  lngA586 = this.lngA11;
  lngA587 = this.lngA12;
  lngA588 = this.lngA13;
  lngA589 = this.lngA14;
  lngA590 = this.lngA15;
  lngA591 = ["Speichertemperatur"];
  lngA592 = ["T Raum"];
  lngA593 = ["T Raum 1h"];
  lngA594 = ["T Warmwasser"];
  lngA595 = ["T Pool"];
  lngA596 = ["T Solar"];
  lngA682 = ["im Heizkreis"];
  lngA683 = ["im K\xFChlkreis"];
  lngA684 = ["im Warmwasserspeicher"];
  lngA685 = ["im Pool"];
  lngA689 = ["Leistungsbegrenzung Max. Ausgang"];
  lngA690 = ["Leistungsbegrenzung Min. Ausgang"];
  lngA695 = this.lngHeating;
  lngA686 = ["Sondentemperatur"];
  lngA687 = ["Max. Sonden Temperatur"];
  lngA688 = ["Schaltdifferenz max. Temperatur"];
  lngA703 = ["Leistung Au\xDFeneinheit", "Puissance unit\xE9 ext\xE9rieure"];
  lngA746 = ["T Au&szlig;en &empty;1h"];
  lngA747 = ["T Norm-Au&szlig;en"];
  lngA748 = ["T Heizkreis Norm."];
  lngA749 = ["T Heizgrenze"];
  lngA750 = ["T Heizgrenze Soll"];
  lngA751 = ["Grenzwert f\xFCr Sollwert"];
  lngA752 = ["Temperatur Soll"];
  lngA890 = ["I012 Abschaltdruck f\xFCr Kondensation"];
  lngA891 = ["I012 Temperatur entsprechend Abschaltdruck"];
  lngA892 = ["Min. Drehzahl"];
  lngA893 = ["Max. Drehzahl"];
  lngA894 = ["Regelbeginn ab . .  T Warmwasser"];
  lngA894_1 = ["Regelung dT"];
  lngA897 = ["Max. Wert"];
  lngA898 = ["Min. Wert"];
  lngA900 = ["Max. Alarm"];
  lngA901 = ["Min. Alarm"];
  lngA940 = ["Au\xDFentemperatur"];
  lngA943 = ["Drehzahl Prim\xE4rseite"];
  lngA944 = ["Leistung"];
  lngA945 = ["EEV"];
  lngA946 = ["Drehzahl Sekund\xE4r"];
  lngA965 = ["Messumformer 4mA"];
  lngA966 = ["Messumformer 20mA"];
  lngA967 = ["SG Ready Betriebszustand 4"];
  lngA1014 = ["&Delta;T"];
  lngA1015 = ["Messumformer 0V"];
  lngA1016 = ["Messumformer 10V"];
  lngA1019 = ["Umschalttemperatur ext. W\xE4rmeerzeuger bei \xDCberschreitung der T Warmwasser"];
  lngA1020 = ["0V"];
  lngA1021 = ["10V"];
  lngA1022 = ["Durchfluss (Vortex Sensor)"];
  lngA1023 = ["Temperatur (Vortex Sensor)"];
  lngA1027 = ["Aktuell"];
  lngA1028 = ["Min. Drehzahl"];
  lngA1029 = ["Max. Drehzahl"];
  lngA1030 = ["T Vorlauf"];
  lngA1031 = ["Drehzahl"];
  lngA1032 = ["Min. Drehzahl"];
  lngA1033 = ["Max. Drehzahl"];
  lngA1034 = ["T W\xE4rmequelle"];
  lngA1034_2 = ["T Sekund\xE4r"];
  lngA1035 = ["&Delta;T"];
  lngA1094 = ["im Mischerkreis"];
  lngA1097 = ["Offset"];
  lngA1099 = ["Offset"];
  lngA1101 = ["Eintrittstemperatur Solarkollektor"];
  lngA1102 = ["Leistungsbegrenzung"];
  lngA1184 = ["Einsatzbereich Min. Temperatur"];
  lngA1186 = ["Schaltdifferenz"];
  lngA1187 = ["Einschalttemperaturdifferenz gegenu\u0308ber Geo-Ice Absorber"];
  lngA1192 = ["Ausschalttemperatur der W\xE4rmequelle im Winter >"];
  lngA1195 = ["Ausschalttemperatur der W\xE4rmequelle im Sommer >"];
  lngA1196 = ["PV-Modul-Ku\u0308hlung Einschalttemperatur fu\u0308r Ku\u0308hlung"];
  lngA1198 = ["PV-Modul-Ku\u0308hlung Ausschalttemperatur bei W\xE4rmequelleneintritt"];
  lngA1194 = ["15 Min.-Mittelwert der Netzeinspeisung"];
  lngA1220 = ["Grenzwert W\xE4rmequellenaustritt"];
  lngA1223 = ["Photovoltaik \xDCberschuss"];
  lngA1224 = ["Einschaltgrenzwert fu\u0308r PV"];
  lngA1231 = ["Frostschutz"];
  lngA1249 = ["Umschalttemperatur ext. W\xE4rmeerzeuger bei \xDCberschreitung der T Vorlauf"];
  lngA3000 = [];
  lngA3001 = [];
  lngA3002 = [];
  lngA3003 = [];
  lngA3004 = [];
  lngA3005 = [];
  lngD1 = ["F100: Motorschutzschalter 1", "Motor protection 1", "Protection moteur 1"];
  lngD2 = ["F101: Motorschutzschalter 2", "Motor protection 2", "Protection moteur 2"];
  lngD3 = ["F102: Phasenfolge\xFCberwachung", "Phase/Rot. field", "Erreur de phases"];
  lngD4 = ["F103: St\xF6rung Durchfluss", "No Flow", "Panne d\xE9bit"];
  lngD5 = ["F110: HD-Pressostat", "high pressure", "Pressostat HP"];
  lngD6 = [
    "F111: Verfl\xFCssigungstemperatur zu niedrig",
    "Condensing temperature too low",
    "Temp\xE9rature de condensation trop basse"
  ];
  lngD7 = ["F120: ND-Pressostat", "low pressure", "Pressostat BP"];
  lngD8 = [
    "F121: Druck\xFCberwachung Verdampfer",
    "Pressure monitoring evaporator",
    "Contr\xF4le de pression \xE9vaporateur"
  ];
  lngD9 = [
    "F122: Temperatur\xFCberwachung Verdampfer",
    "Temperate monitoring evaporator",
    "Contr\xF4le de la temp\xE9rature d'\xE9vaporation"
  ];
  lngD10 = ["F123: Nasslauf", "Bad evaporating", "Gaz liquide"];
  lngD11 = ["F130: Ausfall 4-Wege Ventil", "Failure 4-way valve", "Panne vanne 4-voies"];
  lngD12 = [
    "F200: Steuerger\xE4t Kommunikations\xFCberwachung Ausfall",
    "Failure control unit communication monitoring",
    "Panne contr\xF4le de communication de l'unit\xE9 de contr\xF4le"
  ];
  lngD13 = [
    "F201: Das Ger\xE4t pCOe oder EVD ist nicht vorhanden, funktioniert nicht richtig",
    "Device pCOe or EVD is not available, does not function properly",
    "Le pCOe ou le EVD est absent ou ne fonctionne pas"
  ];
  lngD14 = ["F301: Ventilmotorfehler", "Valve motor error", "Erreur moteur de vanne"];
  lngD15 = ["F600: St\xF6rung Au&szlig;eneinheit", "Malfunction outdoor unit", "Panne unit\xE9 ext\xE9rieure"];
  lngD16 = this.lngTotal;
  lngD17 = [];
  lngD18 = [];
  lngD19 = [];
  lngD20 = [];
  lngD21 = [];
  lngD22 = ["speichern", "save"];
  lngD23 = ["Heizbetrieb", "Heating", "Chauffage"];
  lngD24 = this.lngTimeTable;
  lngD25 = ["Heizbetrieb", "Heating", "Chauffage"];
  lngD26 = [];
  lngD27 = ["Uhr automatisch auf Sommer-/Winterzeit umstellen"];
  lngD28 = [];
  lngD29 = [];
  lngD30 = [];
  lngD31 = [];
  lngD32 = ["Anforderung"];
  lngD33 = ["Freigabe gesamt"];
  lngD34 = [];
  lngD35 = [];
  lngD72 = [];
  lngD74 = ["K\xFChlbetrieb"];
  lngD84 = ["Betriebsweise"];
  lngD84_0 = ["Naturk\xFChlung"];
  lngD84_1 = ["Umkehrk\xFChlung"];
  lngD117 = ["Warmwasserbetrieb"];
  lngD118 = this.lngD24;
  lngD75 = this.lngD24;
  lngD160 = ["Pool-Heizbetrieb"];
  lngD161 = this.lngTimeTable;
  lngD162 = ["Betriebspunkt"];
  lngD163 = ["Anforderung"];
  lngD164 = ["Freigabe gesamt"];
  lngD196 = ["Solarbetrieb"];
  lngD232 = ["Ext. W\xE4rmeerzeuger"];
  lngD239 = ["EVU Sperrzeit"];
  lngD240 = ["Verf\xFCgbar"];
  lngD241 = this.lngTimeTable;
  lngD242 = ["Betriebspunkt"];
  lngD243 = ["Anforderung"];
  lngD244 = ["Freigabe gesamt"];
  lngD248 = ["Mischerkreis"];
  lngD249 = this.lngTimeTable;
  lngD250 = ["Betriebspunkt"];
  lngD251 = ["Heizbetrieb"];
  lngD252 = this.lngD74;
  lngD253 = ["Anforderung"];
  lngD254 = ["Freigabe Gesamt"];
  lngD289 = ["Heizbetrieb"];
  lngD290 = this.lngD74;
  lngD291 = ["Mischerkreis 2"];
  lngD334 = ["Mischerkreis 3"];
  lngD377 = ["Speicherpumpe"];
  lngD378 = this.lngTimeTable;
  lngD379 = ["Betriebspunkt"];
  lngD382 = ["Anforderung"];
  lngD383 = ["Freigabe Gesamt"];
  lngD421 = ["K\xFChlbetrieb blockieren", "Block cooling mode", "Bloquer le rafraichissement"];
  lngD422 = ["Warmwasserbereitung blockieren", "Block domestic hot water production", "Bloquer la production d'ECS"];
  lngD423 = ["Pool-Heizbetrieb blockieren", "Block pool heating mode", "Bloquer le chauffage piscine"];
  lngD428 = this.lngTotal;
  lngD430 = ["Quellenpumpe"];
  lngD437 = ["Fl\xFCstermodus"];
  lngD438 = ["Alarmausgang"];
  lngD439 = this.lngD437;
  lngD440 = ["K\xFChlsignal"];
  lngD441 = ["HD-Pressostat"];
  lngD442 = ["ND-Pressostat"];
  lngD445 = ["Au&szlig;eneinheit"];
  lngD446 = ["Externe Abschaltung"];
  lngD446QL = ["AEH Abtauvorgang"];
  lngD454 = ["SM Kompressor 1"];
  lngD455 = ["SM Kompressor 2"];
  lngD456 = ["SM Phase"];
  lngD457 = ["SM Volumenstrom"];
  lngD549 = ["Pool-Umw\xE4zpumpe"];
  lngD550 = ["Stufenbegrenzung"];
  lngD576 = ["0-10V Eingang Temp. Au&szlig;en"];
  lngD577 = ["Heizbetrieb"];
  lngD578 = ["K\xFChlbetrieb"];
  lngD579 = ["T Quelle Aus &lt; OK", "T source out &lt;OK", "T sortie captage&lt;OK"];
  lngD580 = ["p Kondensator &gt; OK", "p condensation&gt;OK", "p condensation&gt;OK"];
  lngD581 = ["Externe Abschaltung (EVU)", "Ext. off (EVU)", "Coupure externe (EVU)"];
  lngD582 = ["Schalth\xE4ufigkeit", "Switching interval", "Arr\xEAt fr\xE9quence d\xE9marrage"];
  lngD583 = ["T Quelle Aus ERR", "T Source Out ERR", "T sortie de captage ERR"];
  lngD584 = [
    "Umschalttemperatur auf Ext. W\xE4rmeerzeuger erreicht.",
    "Change-over temperature reached on ext. heat generator.",
    "Temp\xE9rature de bivalence atteinte pour l'enclenchement du chauffage externe."
  ];
  lngD585 = [
    "Au&szlig;entemperatur zu niedrig. Unterbrechung durch Abschaltung der W\xE4rmepumpe	",
    "External temperature too low. Interruption by disconnecting heat pump	",
    "Temp\xE9rature ext\xE9rieure trop basse. Arr\xEAt de la PAC."
  ];
  lngD586 = [
    "Vorlauftemperaturbegrenzung im K\xFChlkreis unterschritten",
    "Falling below flow temperature limit in cooling circuit",
    "La temp\xE9rature de d\xE9part en mode rafraichissement est en dessous de la temp\xE9rature limite"
  ];
  lngD587 = [
    "R\xFCcklauftemperaturbegrenzung im K\xFChlkreis unterschritten",
    "Falling below return temperature limit in cooling circuit",
    "La temp\xE9rature de retour en mode rafraichissement est en dessous de la temp\xE9rature limite"
  ];
  lngD588 = [
    "R\xFCcklauftemperaturgrenzwert bei Abtauvorgang unterschritten",
    "Falling below return temperature limit during defrost cycle",
    "On est en dessous de la temp\xE9rature limite retour en mode d\xE9givrage"
  ];
  lngD589 = ["T Verdampfer &lt; OK", "T evaporation &lt;OK", "T \xE9vaporation &lt;OK"];
  lngD590 = ["T Quelle Aus &lt; OK", "T source out &lt;OK", "T sortie captage&lt;OK"];
  lngD591 = [
    "Temperaturdifferenz &Delta;T W\xE4rmequelleneintritt - W\xE4rmequellenaustritt &gt; OK",
    "Temperature difference &Delta;T heat source input - heat source output &gt; OK",
    "T entr\xE9e captage - T sortie captage &gt; OK"
  ];
  lngD592 = [
    "Temperaturdifferenz &Delta;T W\xE4rmequellenaustritt - Verdampfungstemperatur &gt; 6,0K",
    "T source in - T source out &gt; 6K",
    "T sortie captage - T \xE9vaporation &gt; 6K"
  ];
  lngD593 = [
    "Temperaturdifferenz &Delta;T  Heizungsvorlauf - Heizungsr\xFCcklauf  &lt; OK",
    "Temperature difference &Delta;T heating flow - heating return &lt; OK",
    "T d\xE9part chauffage - T retour chauffage &lt; OK"
  ];
  lngD594 = [
    "Temperaturdifferenz &Delta;T  Heizungsvorlauf - Heizungsr\xFCcklauf  &gt; OK",
    "Temperature difference &Delta;T heating flow - heating return &gt; OK",
    "T d\xE9part chauffage - T retour chauffage &gt; OK"
  ];
  lngD595 = [
    "Temperaturdifferenz &Delta;T Kondensation - Heizungsvorlauf &gt; 10,0K",
    "Temperature difference &Delta;T condensation -  heating flow &gt; 10.0K",
    "T condensation - T d\xE9part chauffage &gt; 10,0K"
  ];
  lngD596 = ["F\xFChler ERR: p Verdampfer", "Sensor Error: p Evaporation", "Erreur de sonde: p \xC9vaporation"];
  lngD597 = ["F\xFChler ERR: p Kondensator", "Sensor Error: p Condensation", "Erreur de sonde: p Condensation"];
  lngD598 = ["F\xFChler ERR: T Quelle Ein", "Sensor ERR: T Source In", "Erreur de sonde: T sortie captage"];
  lngD599 = ["F\xFChler ERR: T Quelle Aus", "Sensor ERR: T Source Out", "Erreur de sonde: T entr\xE9e captage"];
  lngD600 = ["F\xFChler ERR: T Hzg R\xFCcklauf", "Sensor ERR: T Htg return", "Erreur de sonde: T retour chauffage"];
  lngD601 = ["F\xFChler ERR: T Hzg Vorlauf", "Sensor ERR: T Htg flow", "Erreur de sonde: T d\xE9part chauffage"];
  lngD602 = [
    "F\xFChler ERR: T Au&szlig;enf\xFChler",
    "Sensor ERR: T external sensor",
    "Erreur de sonde: T ext\xE9rieure"
  ];
  lngD603 = ["F\xFChler ERR: T Warmwasser", "Sensor ERR: T Dom.hot water", "Erreur de sonde: T ECS"];
  lngD604 = ["F\xFChler ERR: T Raumf\xFChler", "Sensor ERR: T Room sensor", "Erreur de sonde: T pi\xE8ce pilote"];
  lngD605 = ["F\xFChler ERR: T Pool", "Sensor ERR: T Pool", "Erreur de sonde: T piscine"];
  lngD606 = ["F\xFChler ERR: T Saugleitung", "Sensor ERR: T Suction line", "Erreur de sonde: T gaz aspir\xE9"];
  lngD607 = [
    "F\xFChler ERR: T Solarkollektor Vorlauf",
    "Sensor ERR: T Solar collector flow",
    "Erreur de sonde: T d\xE9part collecteur solaire"
  ];
  lngD608 = [
    "F\xFChler ERR: T Solarkollektor",
    "Sensor ERR: T Solar collector",
    "Erreur de sonde: T collecteur solaire"
  ];
  lngD609 = ["F\xFChler ERR: T Speicher", "Sensor ERR: T Storage tank", "Erreur de sonde: T ballon tampon"];
  lngD610 = [
    "Speicherf\xFChlerfehler Umschaltung auf R\xFCcklaufregelung",
    "Storage tank sensor error change-over to return control",
    "Sonde de temp\xE9rature ballon, commutation en r\xE9gulation sur retour"
  ];
  lngD611 = [
    "Vorlauftemperaturbegrenzung im K\xFChlkreis unterschritten",
    "Falling below flow temperature limit in cooling circuit",
    "T d\xE9part en mode rafraichissement en dessous de la temp\xE9rature limite"
  ];
  lngD612 = [
    "Handbetrieb aktiviert: Heizbetrieb",
    "Manual mode activated: Heating mode",
    "Mode manuel activ\xE9: Chauffage"
  ];
  lngD613 = [
    "Handbetrieb aktiviert: K\xFChlbetrieb",
    "Manual mode activated: Cooling mode",
    "Mode manuel activ\xE9: Rafraichissement"
  ];
  lngD614 = [
    "Handbetrieb aktiviert: Warmwasserbetrieb",
    "Manual mode activated: Domestic hot water mode",
    "Mode manuel activ\xE9: ECS"
  ];
  lngD615 = [
    "Handbetrieb aktiviert: Pool-Heizbetrieb",
    "Manual mode activated: Pool heating mode",
    "Mode manuel activ\xE9: Piscine"
  ];
  lngD616 = [
    "Handbetrieb aktiviert: Solar-Heizbetrieb",
    "Manual mode activated: Solar heating mode",
    "Mode manuel activ\xE9: Solaire"
  ];
  lngD617 = [
    "Handbetrieb aktiviert: Ext. W\xE4rmeerzeuger",
    "Manual mode activated: Ext. heat generator",
    "Mode manuel activ\xE9: Chauffage externe"
  ];
  lngD618 = [
    "Handbetrieb aktiviert: Speicherpumpe",
    "Manual mode activated: Storage pump",
    "Mode manuel activ\xE9: Pompe de ballon"
  ];
  lngD619 = [
    "Handbetrieb aktiviert: Schaltausg&auml;nge",
    "Manual mode activated: Valves/pump",
    "Mode manuel activ\xE9: Vannes/Pompes"
  ];
  lngD620 = [];
  lngD621 = [];
  lngD622 = [];
  lngD623 = [];
  lngD624 = [];
  lngD625 = [];
  lngD626 = ["Stillstandszeit"];
  lngD627 = [];
  lngD628 = [];
  lngD629 = [];
  lngD631 = [];
  lngD632 = [];
  lngD633 = [];
  lngD634 = this.lngTotal;
  lngD635 = ["Photovoltaik"];
  lngD636 = ["Zeitprogramm"];
  lngD637 = ["Betriebspunkt"];
  lngD638 = ["Anforderung"];
  lngD639 = ["Freigabe gesamt"];
  lngD640 = [];
  lngD641 = [];
  lngD642 = [];
  lngD643 = [];
  lngD644 = [];
  lngD645 = [];
  lngD646 = [];
  lngD647 = [];
  lngD648 = [];
  lngD649 = [];
  lngD650 = [];
  lngD670 = ["Expertenansicht aktivieren"];
  lngD679 = ["Drucktransmitter"];
  lngD706 = ["Raumf\xFChler"];
  lngD707 = ["Speicherf\xFChler"];
  lngD708 = ["Bivalenz alternativ"];
  lngD715 = ["F601: St\xF6rung Au\xDFeneinheit 2", "Malfunction outdoor unit 2", "Panne unit\xE9 ext\xE9rieure 2"];
  lngD716 = ["F602: St\xF6rung Au\xDFeneinheit 3", "Malfunction outdoor unit 3", "Panne unit\xE9 ext\xE9rieure 3"];
  lngD717 = ["F603: St\xF6rung Au\xDFeneinheit 4", "Malfunction outdoor unit 4", "Panne unit\xE9 ext\xE9rieure 4"];
  lngD777 = ["Warmwasser"];
  lngD780 = ["K\xE4ltemitteldruck zu hoch", "Pression circuit frigorifique trop \xE9lev\xE9e"];
  lngD789 = ["Regelverhalten"];
  lngD790 = ["Regelverhalten"];
  lngD791 = ["Ext. Messwert Warmwasser"];
  lngD792 = ["Regelverhalten"];
  lngD794 = ["Alarm Reset"];
  h5D795 = ["SG Ready"];
  lngD795 = ["SG Ready Unterst\xFCtzung"];
  lngD796 = ["SG1: EVU-Sperre"];
  lngD797 = ["SG2: Normalbetrieb"];
  lngD798 = ["SG3: Sollwerterh."];
  lngD799 = ["SG4: Zwangslauf"];
  lngD801 = ["Werte \xFCbernehmen?"];
  lngD810 = ["Alarm"];
  lngD815 = ["SM Quellenseite"];
  lngD816 = ["SM Heizungsseite"];
  lngD817 = ["SG Ready-A/ EVU"];
  lngD818 = ["SG Ready-B/ Sollw."];
  lngD821 = ["HD-Pressostat"];
  lngD822 = ["ND-Pressostat"];
  lngD823 = ["Motorschutz 1"];
  lngD824 = ["Motorschutz 2"];
  lngD830 = ["T Verdampfer < OK"];
  lngD831 = ["T Quelle Aus < OK"];
  lngD832 = ["Temperatur: \u0394T QE - QA>OK"];
  lngD833 = ["Temperatur: \u0394T QA - Verd.>OK"];
  lngD834 = ["Temperatur: \u0394T HA - HE <OK"];
  lngD835 = ["Temperatur: \u0394T HA - HE >OK"];
  lngD836 = ["Temperatur: \u0394T Kond.- HA >OK"];
  lngD837 = ["p Kondensator > OK"];
  lngD878 = ["Schaltzustand Motorventil bei zykl. Messung"];
  lngD880 = ["Kabelbruch\xFCberwachung"];
  lngD881 = ["Kabelbruch\xFCberwachung"];
  lngD890 = ["F701: Bit 0 : Low pressure				 "];
  lngD891 = ["F702: Bit 1 : Low superheat			 "];
  lngD892 = ["F703: Bit 2 : High superheat			 "];
  lngD893 = ["F704: Bit 3 : n/a						 "];
  lngD894 = ["F705: Bit 4 : EVI high superheat (warnin"];
  lngD895 = ["F706: Bit 5 : Refrigerant loss (warning)"];
  lngD896 = ["F707: Bit 6 : High cond. pressure		 "];
  lngD897 = ["F708: Bit 7 : Envelope Tc low (warning) "];
  lngD898 = ["F709: Bit 8 : Envelope Tc high (warning)"];
  lngD899 = ["F710: Bit 9 : Envelope Te low (warning) "];
  lngD900 = ["F711: Bit 10 : Envelope Te high (warning"];
  lngD901 = ["F712: Bit 11 : Freeze alarm (future use)"];
  lngD902 = ["F713: Bit 12 : Envelope alarm			 "];
  lngD903 = ["F714: Bit 13 : Defrost term. by time	 "];
  lngD904 = ["F715: Bit 14 : n/a						 "];
  lngD905 = ["F716: Bit 15 : n/a						 "];
  lngD906 = ["F733: Bit 0 : Cooling valve			 "];
  lngD907 = ["F734: Bit 1 : EVI valve (Heating valve, "];
  lngD908 = ["F735: Bit 2 : n/a						 "];
  lngD909 = ["F736: Bit 3 : P1 sensor				 "];
  lngD910 = ["F737: Bit 4 : P2 sensor				 "];
  lngD911 = ["F738: Bit 5 : P3 sensor				 "];
  lngD912 = ["F739: Bit 6 : n/a						 "];
  lngD913 = ["F740: Bit 7 : n/a						 "];
  lngD914 = ["F741: Bit 8 : n/a						 "];
  lngD915 = ["F742: Bit 9 : T4 sensor				 "];
  lngD916 = ["F743: Bit 10 : T7 sensor (timeout 60 sec"];
  lngD917 = ["F744: Bit 11 : n/a						 "];
  lngD918 = ["F745: Bit 12 : T6 sensor				 "];
  lngD919 = ["F746: Bit 13 : T5 sensor				 "];
  lngD920 = ["F747: Bit 14 : VSS communication		 "];
  lngD921 = ["F748: Bit 15 : n/a						 "];
  lngD922 = ["F749: Bit 0 : High pressure switch		 "];
  lngD923 = ["F750: Bit 1 : VSS locked (needs 2 minute"];
  lngD924 = ["F751: Bit 2 : EEPROM failure			 "];
  lngD925 = ["F752: Bit 3 : Communication timeout to s"];
  lngD926 = ["F753: Bit 4 : Compressor alarm			 "];
  lngD927 = ["F765: Bit 0: Inverter Over Current		 "];
  lngD928 = ["F766: Bit 1: PFC Over Current			 "];
  lngD929 = ["F767: Bit 2: DC Over Voltage			 "];
  lngD930 = ["F768: Bit 3: DC Under Voltage			 "];
  lngD931 = ["F769: Bit 4: AC Over Voltage			 "];
  lngD932 = ["F770: Bit 5: AC Under Voltage			 "];
  lngD933 = ["F771: Bit 6: AC Voltage Imbalance		 "];
  lngD934 = ["F772: Bit 7: Inverter Desaturation		 "];
  lngD935 = ["F773: 									 "];
  lngD936 = ["F774: 									 "];
  lngD937 = ["F775: 									 "];
  lngD938 = ["F776: Bit 11: Inverter Over Temp		 "];
  lngD939 = ["F777: Bit 12: PFC Over Temp			 "];
  lngD940 = ["F778: Bit 13: Lost Rotor				 "];
  lngD941 = ["F779: Bit 14: Arithmetic Error			 "];
  lngD942 = ["F780: Bit 15: Precharge Relay Open		 "];
  lngD943 = ["F781: Bit 0: DC Voltage Low			 "];
  lngD944 = ["F782: 									 "];
  lngD945 = ["F783: Bit 2: Torque Limit Timeout		 "];
  lngD946 = ["F784: 									 "];
  lngD947 = ["F785: 									 "];
  lngD948 = ["F786: 									 "];
  lngD949 = ["F787: 									 "];
  lngD950 = ["F788: Bit 7: Modbus Comms Lost			 "];
  lngD951 = ["F789: Bit 8: Scroll Temp High			 "];
  lngD952 = ["F790: Bit 9: Motor Temp High			 "];
  lngD953 = ["F791: Bit 10: Board Temp High			 "];
  lngD954 = ["F792: Bit 11: Inverter Temp High		 "];
  lngD955 = ["F793: Bit 12: PFC Temp High			 "];
  lngD956 = ["F794: Bit 13: DSP to Comms Lost		 "];
  lngD957 = ["F795: Bit 14: Comms to DSP Lost		 "];
  lngD958 = ["F796: 									 "];
  lngD959 = ["F797: Bit 0: Inverter Current Imbalance "];
  lngD960 = ["F798: Bit 1: PFC Current Imbalance		 "];
  lngD961 = ["F799: Bit 2: Logic supply Out of Range	 "];
  lngD962 = ["F800: Bit 3: Motor Overspeed			 "];
  lngD963 = ["F801: 									 "];
  lngD964 = ["F802: 									 "];
  lngD965 = ["F803: 									 "];
  lngD966 = ["F804: 									 "];
  lngD967 = ["F805: 									 "];
  lngD968 = ["F806: 									 "];
  lngD969 = ["F807: 									 "];
  lngD970 = ["F808: 									 "];
  lngD971 = ["F809: 									 "];
  lngD972 = ["F810: 									 "];
  lngD973 = ["F811: 									 "];
  lngD974 = ["F812: 									 "];
  lngD975 = ["F813: Bit 0: Inverter Temp Imbalance	 "];
  lngD976 = ["F814: Bit 1: PFC Temp Imbalance		 "];
  lngD977 = ["F815: Bit 2: Scroll Temp Low			 "];
  lngD978 = ["F816: Bit 3: Motor Temp Low			 "];
  lngD979 = ["F817: Bit 4: Board Temp Low			 "];
  lngD980 = ["F818: Bit 5: Inverter Temp Low			 "];
  lngD981 = ["F819: Bit 6: PFC Temp Low				 "];
  lngD982 = ["F820: Bit 7: Comms ADC Failure			 "];
  lngD983 = ["F821: 									 "];
  lngD984 = ["F822: 									 "];
  lngD985 = ["F823: 									 "];
  lngD986 = ["F824: 									 "];
  lngD987 = ["F825: 									 "];
  lngD988 = ["F826: 									 "];
  lngD989 = ["F827: 									 "];
  lngD990 = ["F828: Bit 15: Fault limit Lockout		 "];
  lngD994 = ["Regelverhalten"];
  lngD995 = ["Regelverhalten"];
  lngD996 = ["Aktiviert"];
  lngD997 = ["Aktiviert"];
  lngD998 = ["Beginn der Regelung mit"];
  lngD998_1 = ["Min. Drehzahl"];
  lngD998_2 = ["Max. Drehzahl"];
  lngD999 = ["Beginn der Regelung mit"];
  lngD999_1 = ["Min. Drehzahl"];
  lngD999_2 = ["Max. Drehzahl"];
  lngD1000 = ["Beginn der Regelung mit"];
  lngD1000_1 = ["Min. Drehzahl"];
  lngD1000_2 = ["Max. Drehzahl"];
  lngD1001 = ["Funktionsheizen"];
  lngD1002 = ["Belegreifheizen"];
  lngD1007 = ["Dienst verf\xFCgbar: Alarm"];
  lngD1008 = ["Dienst verf\xFCgbar: Thermische Desinfektion"];
  lngD1009 = ["Dauerbetrieb"];
  lngD1010 = ["SM Phase/Drehf."];
  lngD1011 = ["Abtaufunktion der PV-Anlage"];
  lngD1012 = ["W\xE4rmepumpe auf Werkseinstellungen zur\xFCcksetzen"];
  lngD1013 = ["Kalibrierung ND-Pressostat"];
  lngD1014 = ["Kalibriert?"];
  lngD1015 = ["Kalibrierung HD-Pressostat"];
  lngD1016 = ["Kalibriert?"];
  lngD1028 = ["\xD6lsumpftemperatur"];
  lngD1103 = ["Dauerbetrieb Heizungsumw\xE4lzpumpe w\xE4hrend Heizperiode"];
  lngD1104 = ["Dauerbetrieb Heizungsumw\xE4lzpumpe w\xE4hrend K\xFChlperiode"];
  lngD1105 = ["Dauerbetrieb W\xE4rmequellenpumpe w\xE4hrend Ku\u0308hlperiode"];
  lngD1117 = ["Unterbrechung"];
  lngD1118 = ["Durchflussschalter"];
  lngD1124 = ["Durchflussschalter Vereisungssensor"];
  lngD1167 = ["Warmwasserbetrieb"];
  lngD1181 = ["Sommer", "Summer"];
  lngD1182 = ["\xFCbergangszeit"];
  lngD1183 = ["Winter", "Winter"];
  lngD1261 = ["Jahr", "Year", "Ann\xE9e"];
  lngI1 = ["Firmware"];
  lngI2 = ["Build"];
  lngI3 = ["BIOS"];
  lngI4 = [];
  lngI5 = ["BIOS Datum"];
  lngI8 = this.lngTime;
  lngI30 = this.lngOpMode;
  lngI31 = this.lngOpMode;
  lngI32 = this.lngOpMode;
  lngI33 = this.lngOpMode;
  lngI34 = this.lngOpMode;
  lngI35 = ["Ext. W\xE4rmeerzeuger"];
  lngI36 = this.lngOpMode;
  lngI37 = this.lngOpMode;
  lngI38 = [];
  lngI39 = [];
  lngI40 = this.lngOpMode;
  lngI41 = this.lngOpMode;
  lngI42 = this.lngOpMode;
  lngI43 = [];
  lngI44 = [];
  lngI45 = [];
  lngI46 = [];
  lngI47 = [];
  lngI48 = [];
  lngI49 = [];
  lngI50 = [];
  lngI91 = ["PIN-Nummer", "PIN"];
  lngI96 = ["IP-Adresse (WebInterface)"];
  lngI100 = ["Regler nach Neustart zur\xFCcksetzen"];
  lngI101 = ["Alarm Reset", "Alarm Reset"];
  lngI105 = ["W\xE4rmepumpen-Baureihe"];
  lngI107 = ["Betriebsweise der W\xE4rmepumpe"];
  lngI107_0 = ["Monovalent"];
  lngI107_1 = ["Bivalent-parallel"];
  lngI107_2 = ["Bivalent-teilparallel"];
  lngI107_3 = ["Bivalent-alternativ"];
  lngI108 = ["Steuermodus"];
  lngI109 = ["Au\xDFeneinheit"];
  lngI110 = ["W\xE4rmepumpen-Typ", "Type", "Type PAC"];
  lngI111 = ["K\xE4ltemittel"];
  lngI112 = ["Ausstattung"];
  lngI113 = ["Leistungsregelung"];
  lngI114 = ["Seriennummer"];
  lngI116 = ["W\xE4rmequelle"];
  lngI116_0 = ["Wasser (Grundwasser)"];
  lngI116_1 = ["Wasser indirekt"];
  lngI116_2 = ["Erdreich (Sonden -3\xB0C)"];
  lngI116_3 = ["Erdreich (Sonden -9\xB0C)"];
  lngI116_4 = ["Eisspeicher"];
  lngI116_5 = ["Direktverdampfung"];
  lngI136 = this.lngOpMode;
  lngI137 = ["Heizbetrieb", "Heating", "Chauffage"];
  lngI138 = ["K\xFChlung", "Cooling", "Rafraichissement"];
  lngI139 = ["Warmwasser", "Hot water", "ECS"];
  lngI140 = ["Pool-Heizbetrieb", "Pool", "Piscine"];
  lngI143 = ["Solarbetrieb", "Solar", "Solaire"];
  lngI148 = ["Leistungssteuerung"];
  lngI263 = ["Temperaturanpassung", "Temperature adjustment", "Adaptation de temp\xE9rature"];
  lngI265 = ["Heizungsregelung"];
  lngI265_0 = ["Witterungsgef\xFChrt"];
  lngI265_1 = ["Sollwertvorgabe"];
  lngI265_2 = ["Sollwertvorgabe BMS"];
  lngI265_3 = ["Sollwertvorgabe EXT"];
  lngI265_4 = ["Sollwertvorgabe 0-10V"];
  lngI266 = ["Temperaturregelung im Heizbetrieb"];
  lngI266_0 = ["R\xFCcklauftemperatur"];
  lngI266_1 = this.lngA591;
  lngI266_2 = ["Kondensatoreintritt"];
  lngI267 = ["Max. Intervall zykl. Messung (Min.)"];
  lngI268 = [];
  lngI269 = ["Dauer der zykl. Messung"];
  lngI270 = [];
  lngI274 = ["K\xFChlregelung"];
  lngI274_0 = ["Witterungsgef\xFChrt"];
  lngI274_1 = ["Sollwertvorgabe"];
  lngI274_2 = ["Sollwertvorgabe BMS"];
  lngI274_3 = ["Sollwertvorgabe EXT"];
  lngI274_4 = ["Sollwertvorgabe 0-10V"];
  lngI275 = ["Temperaturregelung im K\xFChlbetrieb"];
  lngI275_0 = ["R\xFCcklauftemperatur"];
  lngI275_1 = this.lngA591;
  lngI275_2 = ["Verdampfereintritt"];
  lngI390 = ["Betriebsart der Verdichteranlage im Warmwasserbetrieb"];
  lngI392 = ["Warmwasserregelung"];
  lngI392_0 = ["Witterungsgef\xFChrt"];
  lngI392_1 = ["Sollwertvorgabe"];
  lngI392_2 = ["Sollwertvorgabe BMS"];
  lngI392_3 = ["Sollwertvorgabe EXT"];
  lngI392_4 = ["Sollwertvorgabe 0-10V"];
  lngI501 = [];
  lngI502 = [];
  lngI503 = [];
  lngI504 = [];
  lngI505 = ["Startzeit", "Start time", "D\xE9but"];
  lngI506 = [];
  lngI507 = ["max.Laufzeit", "Max. runtime for", "Temps d'ex\xE9c. maxi."];
  lngI508 = ["Wochenprogramm", "Schedule", "Programme hebdomadaire"];
  lngI509 = [];
  lngI510 = [];
  lngI511 = [];
  lngI512 = [];
  lngI513 = [];
  lngI514 = [];
  lngI515 = [];
  lngI516 = [];
  lngI517 = [
    "Verz\xF6gerung Kompressorstart",
    "Delay for compressor during solar heating",
    "Temps de retard pour Start compresseur"
  ];
  lngI518 = ["Zeit bis Kompressorstart", "Compressor starting in...", "Le compresseur d\xE9marre dans"];
  lngI521 = ["Art der Warmwassererw\xE4rmung zur opt. Speicherausnutzung"];
  lngI525 = ["Leistungssteuerung des W\xE4rmeerzeugers im Pool-Heizbetrieb"];
  lngI527 = ["Poolregelung"];
  lngI640 = ["Maximale Laufzeit Pool-Heizbetrieb"];
  lngI641 = ["Verz\xF6gerung Einsatz Verdichter bei Solarbetrieb"];
  lngI642 = ["Motorventil f\xFCr Pool-Heizbetrieb befindet sich im"];
  lngI647_0 = ["geforderte min. Solarkollektortemperatur"];
  lngI647_1 = ["geforderte min. Solarkollektor Austrittstemperatur"];
  lngI764 = ["Bivalenzpunkt"];
  lngI771 = ["Restlaufzeit"];
  lngI776 = ["Temperaturanpassung"];
  lngI889 = ["Nachstellzeit T<sub>n</sub>"];
  lngI890 = ["Vorhaltezeit T<sub>v</sub>"];
  lngI891 = ["Ventillaufzeit"];
  lngI1260 = ["Monat", "Month", "Mois"];
  lngI1261 = ["Jahr", "Year", "Ann\xE9e"];
  lngI1263 = ["W\xE4rmequellenpumpe"];
  lngI1264 = ["Heizstab"];
  lngI1267 = ["Vorlaufzeit"];
  lngI1268 = ["Nachlaufzeit"];
  lngI1269 = ["Festsitzschutz"];
  lngI1270 = ["Heizungsumw\xE4lzpumpe"];
  lngI1271 = ["Betriebsart"];
  lngI1272 = ["Nachstellzeit T<sub>n</sub>"];
  lngI1273 = ["Vorhaltezeit T<sub>v</sub>"];
  lngI1278 = ["Vorlaufzeit"];
  lngI1279 = ["Nachlaufzeit"];
  lngI1280 = ["Festsitzschutz"];
  lngI1281 = ["Quellenpumpe"];
  lngI1283 = ["Nachstellzeit T<sub>n</sub>"];
  lngI1284 = ["Vorhaltezeit T<sub>v</sub>"];
  lngI1286 = ["Festsitzschutz"];
  lngI1287 = ["Solarumw\xE4lzpumpe"];
  lngI1287_1 = ["sonst. Pumpen"];
  lngI1290 = ["Festsitzschutz"];
  lngI1291 = ["Speicherpumpe"];
  lngI1292 = ["Umschaltzeit"];
  lngI1293 = ["Motorventil Warmwasser"];
  lngI1294 = this.lngI1292;
  lngI1295 = ["Motorventil Pool-Heizbetrieb"];
  lngI1296 = this.lngI1292;
  lngI1297 = ["Motorventil K\xFChlbetrieb"];
  lngI1298 = this.lngI1292;
  lngI1299 = ["Motorventil 4-Wege-Ventil"];
  lngI1304 = ["el. Expansionsventil Magnetventil"];
  lngI1305 = ["Nachstellzeit T<sub>n</sub>"];
  lngI1306 = ["Vorhaltezeit T<sub>v</sub>"];
  lngI1307 = ["Betriebsmodus Verdichter"];
  lngI1308 = ["Nachstellzeit T<sub>n</sub>"];
  lngI1309 = ["Vorhaltezeit T<sub>v</sub>"];
  lngI1311 = ["Leistungsregelung"];
  lngI1312 = ["Nachstellzeit T<sub>n</sub>"];
  lngI1313 = ["Vorhaltezeit T<sub>v</sub>"];
  lngI1314 = ["Betriebsmodus Verdichter"];
  lngI1315 = this.lngStart;
  lngI1317 = this.lngStop;
  lngI1319 = ["Ext. W\xE4rmeerzeuger"];
  h5I1320 = ["Multifunktionsausgang"];
  lngI1320 = ["Multifunktion"];
  lngI1321 = ["Not Aus"];
  lngI1323 = ["Silent-Modus", "Silent mode", "Mode silencieux"];
  lngI1458 = ["Verdichter"];
  lngI1473 = ["Jahr", "Year", "Ann\xE9e"];
  lngI1474 = ["Protokoll"];
  lngI1475 = ["Protokoll"];
  lngI1476 = ["Ger\xE4teadresse"];
  lngI1477 = ["Stillstand-Intervall Kollektorkreispumpe"];
  lngI1478 = ["Pumpenlaufzeit Kollektorkreispumpe"];
  lngI1479 = ["I014 Schalth\xE4ufigkeit"];
  lngI1718 = ["Hardware"];
  lngI1719 = ["F100 / F101 Verz\xF6gerung Motorschutz"];
  lngI1740 = ["Temperaturanpassung"];
  lngI1752 = ["Regelung nach..."];
  lngI1753 = ["Heizbetrieb", "Heating", "Chauffage"];
  lngI1753_1 = this.lngI1752;
  lngI1754 = ["Warmwasserbetrieb"];
  lngI1754_1 = this.lngI1752;
  lngI1763 = ["Pumpentyp"];
  lngI1764 = ["Modus"];
  lngI1770 = this.lngI1292;
  lngI1771 = ["Sondenregeneration"];
  lngI1923 = ["Elektrische Arbeit"];
  lngI1924 = ["Thermische Arbeit"];
  lngI1925 = ["K\xE4ltearbeit (RC)"];
  lngI1926 = ["Verdichter"];
  lngI1927 = ["W\xE4rmequellenpumpe"];
  lngI1928 = ["Heizstab"];
  lngI1929 = ["Heizung"];
  lngI1930 = ["Warmwasser"];
  lngI1931 = ["Pool-Heizbetrieb"];
  lngI1932 = ["\xE4nderungen \xFCbernehmen?"];
  lngI1943 = ["Ventil"];
  lngI1944 = ["Hauptregelung"];
  lngI1944_0 = ["Custom"];
  lngI1944_1 = ["Verbundku\u0308hlm\xF6bel/-raum"];
  lngI1944_2 = ["Ku\u0308hlm\xF6bel/-raum mit eingebautem Verdichter"];
  lngI1944_3 = ["Gest\xF6rte Ku\u0308hlm\xF6bel/-r\xE4ume"];
  lngI1944_4 = ["Ku\u0308hlm\xF6bel/-raum mit subkritischem CO2"];
  lngI1944_5 = ["R404A-Verflu\u0308ssiger fu\u0308r subkritisches CO2"];
  lngI1944_6 = ["Klimager\xE4t/Kaltwassersatz mit Plattenw\xE4rmetauscher"];
  lngI1944_7 = ["Klimager\xE4t/Kaltwassersatz mit Rohrbu\u0308ndelw\xE4rmetauscher"];
  lngI1944_8 = ["Klimager\xE4t/Kaltwassersatz mit Rippenstrahlw\xE4rmetauscher"];
  lngI1944_9 = ["Klimager\xE4t/Kaltwassersatz mit variabler Ku\u0308hlkapazit\xE4t"];
  lngI1944_10 = ["Gest\xF6rte Klimager\xE4te/Kaltwassers\xE4tze"];
  lngI1944_11 = ["EPR-Stauungsdruck"];
  lngI1944_12 = ["Hei\xDFgas-Bypass in Druck"];
  lngI1944_13 = ["Hei\xDFgas-Bypass in Temperatur"];
  lngI1944_14 = ["Transkritischer CO2-Gasku\u0308hler"];
  lngI1944_15 = ["Analoger Positionsregler (4\u202620 mA)"];
  lngI1944_16 = ["Analoger Positionsregler (0\u202610 V)"];
  lngI1944_17 = ["Klimager\xE4t/Kaltwassersatz oder Ku\u0308hlm\xF6bel/-raum mit adaptiver Regelung"];
  lngI1944_18 = ["Klimager\xE4t/Kaltwassersatz mit digitalem Scroll-Verdichter"];
  lngI1944_19 = ["Klimager\xE4t/Kaltwassersatz mit BLDC-Verdichter"];
  lngI1944_20 = ["\xFCberhitzungsregelung mit 2 Temperaturfu\u0308hlern"];
  lngI1944_21 = ["E/A-Erweiterung fu\u0308r pCO"];
  lngI1945 = ["Hilfsregelung"];
  lngI1945_0 = ["Nutzer Spezifisch"];
  lngI1945_1 = ["Deaktiviert"];
  lngI1945_2 = ["Hohe Verflu\u0308ssiger Temp. Schutz auf S3"];
  lngI1945_3 = ["Modulierendes Thermostat an S4 Fu\u0308hler"];
  lngI1945_4 = ["Backup Fu\u0308hler an S3 und S4"];
  lngI1948 = ["Typ"];
  lngI1948_0 = ["Ratiom. 0-5V"];
  lngI1948_1 = ["4-20mA"];
  lngI1948_2 = ["4-20mA FERN"];
  lngI1948_3 = ["4-20mA EXTERN"];
  lngI1955 = ["Nacherw\xE4rmung"];
  lngI1991 = ["Ausgang Verdichter 1"];
  lngI1992 = ["Ausgang Verdichter 2"];
  lngI1993 = ["Neuer Wert"];
  lngI1994 = ["Startdrehzahl Verdichter Heizen"];
  lngI1995 = ["K\xFChlen Startphase Verdichterdrehzahl"];
  lngI1996 = ["Abtauintervall"];
  lngI1997 = ["Abtauvorgang Dauer"];
  lngI1998 = ["Abtauvorgang Endtemperatur"];
  lngI1999 = ["\xF6lr\xFCckf\xFChrung Verdichterdrehzahl"];
  lngI2000 = ["\xF6lr\xFCckf\xFChrung bei Unterschreitung der Verdichterdrehzahl"];
  lngI2001 = ["\xF6lr\xFCckf\xFChrung Dauer"];
  lngI2002 = ["\xF6lr\xFCckf\xFChrung bei Unterschreitung der Drehzahlschwelle f\xFCr"];
  lngI2003 = ["Ventilator min. Drehzahl"];
  lngI2004 = ["Abtauschwellwert Temperaturdifferenz"];
  lngI2005 = ["Max. Drehzahl bei Unterschreitung der Umgebungstemperatur"];
  lngI2006 = ["Min. Drehzahl bei \xFCberschreitung der Umgebungstemperatur"];
  lngI2007 = ["Frequenzband"];
  lngI2008 = ["Frequenz 1"];
  lngI2009 = ["Frequenz 2"];
  lngI2010 = ["Frequenz 3"];
  lngI2011 = ["Modus"];
  lngI2012 = ["Maximale Verdichterdrehzahl Abtauvorgang"];
  lngI2013 = ["Maximale Verdichterdrehzahl Heizbetrieb"];
  lngI2014 = ["Ventilator max Drehzahl"];
  lngI2015 = ["Minimale Verdichterdrehzahl Abtauvorgang"];
  lngI2016 = ["Betriebsmodus Kapazit\xE4tenanforderung"];
  lngI2017 = ["p1 Sauggas"];
  lngI2018 = ["p2 Austritt"];
  lngI2019 = ["p3 Zwischeneinspritzung"];
  lngI2020 = ["T2 Umgebung"];
  lngI2021 = ["T3 Sauggas"];
  lngI2022 = ["T4 Verdichter"];
  lngI2023 = ["T7 \xD6lsumpf"];
  lngI2024 = ["T6 Fl\xFCssig"];
  lngI2025 = ["T5 EVI"];
  lngI2026 = ["Ventil\xF6ffnung Au\xDFeneinheit"];
  lngI2027 = ["\xFCberhitzung"];
  lngI2028 = ["Sollwert"];
  lngI2029 = ["Ventil\xF6ffnung Inneneinheit"];
  lngI2030 = ["Sollwert"];
  lngI2031 = ["Drehzahl"];
  lngI2032 = ["T Verdampfer"];
  lngI2033 = ["\xDCberhitzung"];
  lngI2034 = ["T Kondensation"];
  lngI2038 = ["Status"];
  lngI2039 = ["T Druckgas"];
  lngI2042 = ["Vortex Sensor"];
  lngI2044 = ["Anmeldeprotokoll"];
  lngI2079 = ["Geschwindigkeit"];
  lngI2080 = ["Grund Abtauvorgang"];
  lngI2081 = ["Abtauung Start"];
  lngI2082 = ["Abtauung Stop"];
  lngI2083 = ["Abtauz\xE4hler"];
  lngI2085 = ["Motorphase"];
  lngI2086 = ["AC Linie (Spannung)"];
  lngI2087 = ["AC Linie (Strom)"];
  lngI2088 = ["AC Linie (Leistung)"];
  lngI2090 = ["Manuell"];
  lngI2091 = ["Drehzahl"];
  lngI2092 = ["Ventilator min. Drehzahl"];
  lngI2093 = ["Ventilator max. Drehzahl"];
  lngI2094 = ["Dauer"];
  lngI2095 = ["Konfiguration"];
  lngI2096 = ["RMH Hauptplatine"];
  lngI2097 = ["RMH Aktuator"];
  lngI2098 = ["Indoor Revision"];
  lngI2099 = ["Outdoor Revision"];
  lngI2100 = ["Betriebsart"];
  lngI2101 = ["K\xFChlbetrieb"];
  lngI2101_1 = ["Regelung nach"];
  lngI2102 = this.lngComp;
  lngI2103 = this.lngPower;
  lngI2195 = ["Verdichter 1"];
  lngI2196 = ["Verdichter 2"];
  lngI2197 = ["Verdichter 3"];
  lngI2198 = ["Verdichter 4"];
  lngI2201 = ["Verdichter (nur WP QL-K)"];
  lngI2202 = ["Verdichter"];
  lngI2203 = ["Einschalttemperatur"];
  lngI2204 = ["Dauer"];
  lngI2205 = ["Software"];
  lngI2206 = ["Status Code"];
  lngI2208 = ["EXV K<sub>p</sub>"];
  lngI2209 = ["Modus"];
  lngI2210 = ["Modus"];
  lngI2211 = ["Abtauschwellwert abs. Temperaturdifferenz"];
  lngI2212 = ["Startdauer"];
  lngI2213 = ["Start\xF6ffnung"];
  lngI2214 = ["Startdauer"];
  lngI2215 = ["Start\xF6ffnung"];
  lngI2216 = ["Startdauer"];
  lngI2217 = ["Start\xF6ffnung"];
  lngI2253 = ["Motorventil Warmwasser bei Sonden Regenerierung"];
  lngI2254 = ["Auschalttemperatur Differenz nach F\xFChler"];
  lngI2256 = ["I019 Stillstandszeit"];
  lngI2255 = ["Auschalttemperatur Differenz Verz\xF6gerungszeit"];
  lngI2257 = ["Leistung"];
  lngI2258 = ["Verdichter Typ"];
  lngI2259 = ["Drucksensor p1"];
  lngI2260 = ["Drucksensor p2"];
  lngI2261 = ["Drucksensor p3"];
  lngI2262 = ["Neuer Wert"];
  lngI2263 = this.lngI2262;
  lngI2264 = ["Startdauer Heizbetrieb"];
  lngI2265 = ["\xFCberhitzung"];
  lngI2266 = ["Sollwert"];
  lngI2267 = ["Reduzierte Leistung Kondensationstemperatur"];
  lngI2268 = ["Reduzierte Leistung Drehzahl"];
  lngI2269 = ["Ventilator Pause nach Abtauvorgang"];
  lngI2270 = ["Normalisierte Temperaturdifferenz"];
  lngI2271 = ["Ventil\xF6ffnung Zwischeneinspritzung"];
  lngI2272 = ["Digital Eingang 1"];
  lngI2273 = ["Digital Ausgang 2"];
  lngI2274 = ["Digital Ausgang 3"];
  lngI2275 = ["\xD6lsumpfheizung"];
  lngI2276 = ["aktuelle Leistung"];
  lngI2277 = ["Hilfsleistung Initialisierungswert"];
  lngI2278 = ["Startdauer K\xFChlbetrieb"];
  lngI2279 = ["Startdauer Abtauvorgang"];
  lngI2280 = ["Startdrehzahl Verdichter K\xFChlen"];
  lngI2281 = ["Verdichter \xFCberstromschutz"];
  lngI2282 = ["Startvorg\xE4nge innerhalb 1h"];
  lngI2283 = ["Startvorg\xE4nge Gesamt"];
  lngI2284 = ["Betriebsstunden"];
  lngI2286 = ["Start\xF6ffnung"];
  lngI2287 = ["EXV K<sub>p</sub>"];
  lngI2288 = ["EXV K<sub>i</sub>"];
  lngI2289 = ["EXV K<sub>d</sub>"];
  lngI2290 = this.lngI2287;
  lngI2291 = this.lngI2288;
  lngI2292 = ["Drehzahl"];
  lngI2293 = ["Energiebilanz"];
  lngI2294 = ["Startdauer"];
  lngI2296 = this.lngI2288;
  lngI2297 = this.lngI2289;
  lngI2301 = ["Steuermodus"];
  lngI2311 = this.lngI2289;
  lngI2312 = ["Handbetrieb"];
  lngI2313 = ["\xD6ffnung"];
  lngI2314 = ["Handbetrieb"];
  lngI2315 = ["\xD6ffnung"];
  lngI2316 = ["Handbetrieb"];
  lngI2317 = ["\xD6ffnung"];
  lngI2318 = ["Handbetrieb"];
  lngI2319 = ["Drehzahl"];
  lngI2320 = this.lngMode;
  lngI2321 = this.lngI2006;
  lngI2322 = this.lngI2005;
  lngI2323 = ["Verz\xF6gerung Verdichter vor Abtauvorgang"];
  lngI2324 = ["Umschalt-Verdichterdrehzahl 4-Wege-Ventil"];
  lngI2325 = ["Umschalt-Druckdifferenz 4-Wege-Ventil"];
  lngI2326 = this.lngPower;
  lngI2327 = this.lngPower;
  lngI2329 = this.lngMode;
  lngI2330 = ["Umschaltzeit"];
  lngI2471 = ["Mittelwert"];
  lngI9999 = ["zyklische Messung"];
  aI2209 = ["Auto Anpassung PID-Parameter", "manueller PID-Parametersatz"];
  aI2320 = [
    this.lngOff[this.iLng],
    this.lngCool[this.iLng],
    this.lngHeat[this.iLng],
    "Standby",
    this.lngManual[this.iLng],
    this.lngAuto[this.iLng]
  ];
  aI2080 = [
    "kein Grund",
    "ext. Befehl",
    "Abtauintervall",
    "Digitaleingang",
    "Abtauschwelle",
    "Abtaudifferenz",
    "LOP"
  ];
  aI2195 = [this.lngOff[this.iLng], this.lngAuto[this.iLng], this.lngOn[this.iLng]];
  aI2100 = [
    this.lngOff[this.iLng],
    this.lngCool[this.iLng],
    this.lngHeat[this.iLng],
    this.lngStandby[this.iLng],
    this.lngManual[this.iLng]
  ];
  aI2038 = [
    this.lngOff[this.iLng],
    this.lngCool[this.iLng],
    this.lngHeat[this.iLng],
    this.lngAlarm[this.iLng],
    "Umschaltung K\xFChlen",
    this.lngDefrost[this.iLng],
    this.lngESCLock[this.iLng],
    this.lngStandby[this.iLng],
    "Umschaltung Heizen",
    "Stoppen",
    this.lngManual[this.iLng],
    "Verdichter Start",
    this.lngESCLock[this.iLng]
  ];
  aI2258 = ["ZHW16", "ZHW08 K1", "ZHW08 K1.1"];
  aI2259 = ["PT5_07", "PT5_18", "PT5_30", "PT5_50"];
  aI2260 = ["PT5_07", "PT5_18", "PT5_30", "PT5_50"];
  aI2261 = ["PT5_07", "PT5_18", "PT5_30", "PT5_50"];
  aI2272 = [this.lngESCLock[this.iLng], "Anforderung Abtauvorgang", "Keine Funktion"];
  aI2273 = [this.lngComp[this.iLng], "Schnittstelle (W21)", "Digital Eingang 1"];
  aI2274 = [
    this.lngAlarm[this.iLng],
    "Schnittstelle (W22)",
    "Digital Eingang 1",
    "Digital Eingang 2",
    "Alarm invertiert"
  ];
  aI2301 = ["Effizienz", this.lngDefault[this.iLng], "Schalloptimierung", "Benutzer"];
  aI2016 = ["Analog 0-10V", "Modbus"];
  aI1307 = [this.lngAuto[this.iLng], this.lngHand[this.iLng]];
  aI1314 = [this.lngAuto[this.iLng], this.lngHand[this.iLng]];
  aI2011 = ["Auto Anpassung PID-Parameter", "manueller PID-Parametersatz"];
  month = [
    this.lngJanuary[this.iLng],
    this.lngFebruary[this.iLng],
    this.lngMarch[this.iLng],
    this.lngApril[this.iLng],
    this.lngMay[this.iLng],
    this.lngJune[this.iLng],
    this.lngJuly[this.iLng],
    this.lngAugust[this.iLng],
    this.lngSeptember[this.iLng],
    this.lngOctober[this.iLng],
    this.lngNovember[this.iLng],
    this.lngDecember[this.iLng]
  ];
  month_short = [
    this.lngMonth_0[this.iLng],
    this.lngMonth_1[this.iLng],
    this.lngMonth_2[this.iLng],
    this.lngMonth_3[this.iLng],
    this.lngMonth_4[this.iLng],
    this.lngMonth_5[this.iLng],
    this.lngMonth_6[this.iLng],
    this.lngMonth_7[this.iLng],
    this.lngMonth_8[this.iLng],
    this.lngMonth_9[this.iLng],
    this.lngMonth_10[this.iLng],
    this.lngMonth_11[this.iLng]
  ];
  day_short = [
    this.lngSu[this.iLng],
    this.lngMo[this.iLng],
    this.lngTu[this.iLng],
    this.lngWe[this.iLng],
    this.lngTh[this.iLng],
    this.lngFr[this.iLng],
    this.lngSa[this.iLng]
  ];
  aI105 = [
    "Custom",
    "Ai1",
    "Ai1+",
    "AiQE",
    "DS 5023",
    "DS 5027Ai",
    "DS 5051",
    "DS 5050T",
    "DS 5110T",
    "DS 5240",
    "DS 6500",
    "DS 502xAi",
    "DS 505x",
    "DS 505xT",
    "DS 51xxT",
    "DS 509x",
    "DS 51xx",
    "EcoTouch Ai1 Geo",
    "EcoTouch DS 5027 Ai",
    "EnergyDock",
    "Basic Line Ai1 Geo",
    "EcoTouch DS 5018 Ai",
    "EcoTouch DS 5050T",
    "EcoTouch DS 5112.5 DT",
    "EcoTouch 5029 Ai",
    "Ai QL / WP QL",
    "WPQL-K",
    "EcoTouch Ai1 Air",
    "EcoTouch Ai1 Air",
    "EcoTouch MB 7010",
    "EcoTouch DA 5018 Ai",
    "EcoTouch Air LCI",
    "EcoTouch Ai1 Air K1.1",
    "EcoTouch DA 5018 Ai K1.1"
  ];
  aI107 = [
    this.lngI107_0[this.iLng],
    this.lngI107_1[this.iLng],
    this.lngI107_2[this.iLng],
    this.lngI107_3[this.iLng]
  ];
  aI108 = [this.lngAuto[this.iLng], this.lngManual[this.iLng], "Extern"];
  aI109 = ["Power Inverter", "Zubadan"];
  aI110 = [
    "Ai1 5005.4",
    "Ai1 5006.4",
    "Ai1 5007.4",
    "Ai1 5008.4",
    "Ai1+ 5006.3",
    "Ai1+ 5007.3",
    "Ai1+ 5009.3",
    "Ai1+ 5011.3",
    "Ai1+ 5006.3 (230V)",
    "Ai1+ 5007.3 (230V)",
    "Ai1+ 5009.3 (230V)",
    "Ai1+ 5011.3 (230V)",
    "DS 5006.3",
    "DS 5008.3",
    "DS 5009.3",
    "DS 5011.3",
    "DS 5014.3",
    "DS 5017.3",
    "DS 5020.3",
    "DS 5023.3",
    "DS 5006.3 (230V)",
    "DS 5008.3 (230V)",
    "DS 5009.3 (230V)",
    "DS 5011.3 (230V)",
    "DS 5014.3 (230V)",
    "DS 5017.3 (230V)",
    "DS 5006.4",
    "DS 5008.4",
    "DS 5009.4",
    "DS 5011.4",
    "DS 5014.4",
    "DS 5017.4",
    "DS 5020.4",
    "DS 5023.4",
    "DS 5007.3 Ai",
    "DS 5009.3 Ai",
    "DS 5010.3 Ai",
    "DS 5012.3 Ai",
    "DS 5015.3 Ai",
    "DS 5019.3 Ai",
    "DS 5022.3 Ai",
    "DS 5025.3 Ai",
    "DS 5007.3 Ai (230V)",
    "DS 5009.3 Ai (230V)",
    "DS 5010.3 Ai (230V)",
    "DS 5012.3 Ai (230V)",
    "DS 5015.3 Ai (230V)",
    "DS 5019.3 Ai (230V)",
    "DS 5007.4 Ai",
    "DS 5009.4 Ai",
    "DS 5010.4 Ai",
    "DS 5012.4 Ai",
    "DS 5015.4 Ai",
    "DS 5019.4 Ai",
    "DS 5022.4 Ai",
    "DS 5025.4 Ai",
    "DS 5007.4 Ai (230V)",
    "DS 5009.4 Ai (230V)",
    "DS 5010.4 Ai (230V)",
    "DS 5012.4 Ai (230V)",
    "DS 5015.4 Ai (230V)",
    "DS 5030.3",
    "DS 5034.3",
    "DS 5043.3",
    "DS 5051.3",
    "DS 5030.4",
    "DS 5034.4",
    "DS 5043.4",
    "DS 5051.4",
    "DS 5030.3 T",
    "DS 5037.3 T",
    "DS 5044.3 T",
    "DS 5050.3 T",
    "DS 5030.4 T",
    "DS 5037.4 T",
    "DS 5044.4 T",
    "DS 5050.4 T",
    "DS 5062.3 T",
    "DS 5072.3 T",
    "DS 5089.3 T",
    "DS 5109.3 T",
    "DS 5062.4 T",
    "DS 5072.4 T",
    "DS 5089.4 T",
    "DS 5109.4 T",
    "DS 5118.3",
    "DS 5136.3",
    "DS 5161.3",
    "DS 5162.3",
    "DS 5193.3",
    "DS 5194.3",
    "DS 5231.3",
    "DS 5118.4",
    "DS 5136.4",
    "DS 5161.4",
    "DS 5162.4",
    "DS 5194.4",
    "DS 6237.3",
    "DS 6271.3",
    "DS 6299.3",
    "DS 6388.3",
    "DS 6438.3",
    "DS 6485.3",
    "DS 6237.4",
    "DS 6271.4",
    "DS 6299.4",
    "DS 6388.4",
    "DS 6438.4",
    "DS 6485.4",
    "Ai1QE 5006.5",
    "Ai1QE 5007.5",
    "Ai1QE 5009.5",
    "Ai1QE 5010.5",
    "Ai1QE 5006.5 (230V)",
    "Ai1QE 5007.5 (230V)",
    "Ai1QE 5009.5 (230V)",
    "Ai1QE 5010.5 (230V)",
    "DS 5008.5Ai",
    "DS 5010.5Ai",
    "DS 5012.5Ai",
    "DS 5014.5Ai",
    "DS 5017.5Ai",
    "DS 5020.5Ai",
    "DS 5023.5Ai",
    "DS 5027.5Ai",
    "DS 5008.5Ai (230V)",
    "DS 5010.5Ai (230V)",
    "DS 5012.5Ai (230V)",
    "DS 5014.5Ai (230V)",
    "DS 5017.5Ai (230V)",
    "DS 5029.5",
    "DS 5033.5",
    "DS 5040.5",
    "DS 5045.5",
    "DS 5050.5",
    "DS 5059.5",
    "DS 5028.5 T",
    "DS 5034.5 T",
    "DS 5040.5 T",
    "DS 5046.5 T",
    "DS 5052.5 T",
    "DS 5058.5 T",
    "DS 5063.5 T",
    "DS 5075.5",
    "DS 5085.5 T",
    "DS 5095.5 T",
    "DS 5112.5 T",
    "DS 5076.5",
    "DS 5095.5",
    "DS 5123.5",
    "DS 5158.5",
    "Ai QL/ WP QL",
    "WP QL (K)",
    "Ai1QE 5013.5",
    "Ai1QE 5013.5 (230V)",
    "DS 5036.4T",
    "DS 5049.4T",
    "DS 5063.4T",
    "DS 5077.4T",
    "DS 5007.5Ai HT",
    "DS 5008.5Ai HT",
    "DS 5010.5Ai HT",
    "DS 5014.5Ai HT",
    "DS 5017.5Ai HT",
    "DS 5023.5Ai HT",
    "DS 5007.5Ai HT (230V)",
    "DS 5008.5Ai HT (230V)",
    "DS 5010.5Ai HT (230V)",
    "DS 5014.5Ai HT (230V)",
    "DS 5017.5Ai HT (230V)",
    "DS 5005.4Ai HT",
    "DS 5007.4Ai HT",
    "DS 5009.4Ai HT",
    "DS 5010.4Ai HT",
    "DS 5012.4Ai HT",
    "DS 5015.4Ai HT",
    "DS 5005.4Ai HT (230V)",
    "DS 5007.4Ai HT (230V)",
    "DS 5009.4Ai HT (230V)",
    "DS 5010.4Ai HT (230V)",
    "5006.5",
    "5008.5",
    "5010.5",
    "5013.5",
    "5006.5 (230V)",
    "5008.5 (230V)",
    "5010.5 (230V)",
    "5013.5 (230V)",
    "PI/Zubadan",
    "5018.5",
    "5010.5",
    "5010.5",
    "DS 5008.5Ai",
    "DS 5010.5Ai",
    "DS 5012.5Ai",
    "DS 5014.5Ai",
    "DS 5017.5Ai",
    "DS 5020.5Ai",
    "DS 5023.5Ai",
    "DS 5027.5Ai",
    "DS 5008.5Ai (230V)",
    "DS 5010.5Ai (230V)",
    "DS 5012.5Ai (230V)",
    "DS 5014.5Ai (230V)",
    "DS 5017.5Ai (230V)",
    "Power+",
    "DS 5145.5 Tandem",
    "DS 5150.5",
    "DS 5182.5 Tandem",
    "DS 5226.5",
    "DS 5235.5 Tandem",
    "DS 6272.5 Trio",
    "DS 6300.5 Tandem",
    "DS 6352.5 Trio",
    "DS 6450.5 Trio",
    "5005.5",
    "5006.5",
    "5007.5",
    "5008.5",
    "5010.5",
    "5005.5 (230V)",
    "5006.5 (230V)",
    "5008.5 (230V)",
    "5010.5 (230V)",
    "DS 5006.5Ai Split",
    "DS 5007.5Ai Split",
    "DS 5009.5Ai Split",
    "DS 5012.5Ai Split",
    "DS 5015.5Ai Split",
    "DS 5020.5Ai Split",
    "DS 5025.5Ai Split",
    "DS 5006.3Ai Split",
    "DS 5007.3Ai Split",
    "DS 5008.3Ai Split",
    "DS 5010.3Ai Split",
    "DS 5012.3Ai Split",
    "DS 5015.3Ai Split",
    "DS 5018.3Ai Split",
    "DS 5020.3Ai Split",
    "5008.5",
    "5011.5",
    "5014.5",
    "5018.5",
    "5008.5 (230V)",
    "5011.5 (230V)",
    "5014.5 (230V)",
    "5018.5 (230V)",
    "5018.5",
    "5010.5",
    "5034.5T",
    "5045.5T",
    "5056.5T",
    "5009.3",
    "5068.5 DT",
    "5090.5 DT",
    "5112.5 DT",
    "5007.3",
    "5011.3",
    "EcoTouch 5007.5Ai",
    "EcoTouch 5008.5Ai",
    "EcoTouch 5010.5Ai",
    "EcoTouch 5014.5Ai",
    "EcoTouch 5018.5Ai",
    "EcoTouch 5023.5Ai",
    "EcoTouch 5029.5Ai",
    "EcoTouch 5007.5Ai",
    "EcoTouch 5008.5Ai",
    "EcoTouch 5010.5Ai",
    "EcoTouch 5014.5Ai",
    "EcoTouch 5018.5Ai",
    "DS 5028.4T HT",
    "EcoTouch compact 5004.5",
    "5010.5",
    "5010.5"
  ];
  aI111 = [
    "R22",
    "R134A",
    "R404A",
    "R407C",
    "R410A",
    "R507",
    "R290",
    "R600",
    "R600a",
    "R717",
    "R744",
    "R728",
    "R1270",
    "R417A",
    "R422d"
  ];
  aI112_QE = [this.lngDefault[this.iLng], "Naturk\xFChlung NC", "Umkehrbetrieb (RC)", "Kombibetrieb"];
  aI112_QL = [this.lngDefault[this.iLng], "NC - Naturk\xFChlung", "RC - Umkehrk\xFChlung"];
  aI113 = ["100%", "50%/100%", "66%/100%", "75%/100%"];
  aI116 = [
    this.lngI116_0[this.iLng],
    this.lngI116_1[this.iLng],
    this.lngI116_2[this.iLng],
    this.lngI116_3[this.iLng],
    this.lngI116_4[this.iLng],
    this.lngI116_5[this.iLng]
  ];
  aI265 = [
    this.lngI265_0[this.iLng],
    this.lngI265_1[this.iLng],
    this.lngI265_2[this.iLng],
    this.lngI265_3[this.iLng],
    this.lngI265_4[this.iLng]
  ];
  aI266 = [this.lngI266_0[this.iLng], this.lngI266_1[this.iLng], this.lngI266_2[this.iLng]];
  aI274 = [
    this.lngI265_0[this.iLng],
    this.lngI265_1[this.iLng],
    this.lngI265_2[this.iLng],
    this.lngI265_3[this.iLng],
    this.lngI265_4[this.iLng]
  ];
  aI275 = [this.lngI266_0[this.iLng], this.lngI266_1[this.iLng], this.lngI266_2[this.iLng]];
  aI392 = [this.lngI392_0[this.iLng], this.lngI392_1[this.iLng], this.lngI392_2[this.iLng]];
  aI1475 = ["LonWorks", "pCOWeb", "Modbus Slave", "KNX"];
  aI2205 = ["pre-Alpha", "Alpha", "Beta", "Release Candidate", "Release", "Stable", "Final", "GA"];
  aI2329 = [
    this.lngAuto[this.iLng],
    this.lngGSI[this.iLng],
    this.lngSolarAbsorber[this.iLng],
    this.lngGSIAbsorber[this.iLng],
    this.lngSolarAbsorber[this.iLng] + " (Z4)",
    "Notheizbetrieb"
  ];
  aOOA = [this.lngOff[this.iLng], this.lngOn[this.iLng], this.lngAuto[this.iLng]];
  aI2196 = this.aI2195;
  aI2197 = this.aI2195;
  aI2198 = this.aI2195;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WaterkotteDictionary
});
//# sourceMappingURL=dictionary.js.map
