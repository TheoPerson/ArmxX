from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "ArmX_V1_User_Guide.pdf"
PAGE_W, PAGE_H = A4

BG = colors.HexColor("#101311")
SURFACE = colors.HexColor("#20251F")
SURFACE_ALT = colors.HexColor("#18201C")
TEXT = colors.HexColor("#F1F2E9")
MUTED = colors.HexColor("#B9BEB2")
DIM = colors.HexColor("#858C80")
ORANGE = colors.HexColor("#FF714E")
MINT = colors.HexColor("#B9D4BC")


def register_fonts():
    regular = Path("C:/Windows/Fonts/segoeui.ttf")
    semibold = Path("C:/Windows/Fonts/seguisb.ttf")
    bold = Path("C:/Windows/Fonts/segoeuib.ttf")
    if regular.exists() and semibold.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("ArmX-Regular", str(regular)))
        pdfmetrics.registerFont(TTFont("ArmX-Semibold", str(semibold)))
        pdfmetrics.registerFont(TTFont("ArmX-Bold", str(bold)))
        return "ArmX-Regular", "ArmX-Semibold", "ArmX-Bold"
    return "Helvetica", "Helvetica-Bold", "Helvetica-Bold"


REGULAR, SEMIBOLD, BOLD = register_fonts()


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="Kicker", fontName=SEMIBOLD, fontSize=8.5, leading=11,
    textColor=ORANGE, tracking=1.5, spaceAfter=8,
))
styles.add(ParagraphStyle(
    name="CoverTitle", fontName=BOLD, fontSize=34, leading=37,
    textColor=TEXT, tracking=-0.8, spaceAfter=14,
))
styles.add(ParagraphStyle(
    name="CoverLead", fontName=REGULAR, fontSize=14, leading=20,
    textColor=MUTED, spaceAfter=18,
))
styles.add(ParagraphStyle(
    name="H1ArmX", fontName=BOLD, fontSize=24, leading=28,
    textColor=TEXT, tracking=-0.35, spaceBefore=4, spaceAfter=15,
))
styles.add(ParagraphStyle(
    name="H2ArmX", fontName=SEMIBOLD, fontSize=13, leading=16,
    textColor=TEXT, spaceAfter=5,
))
styles.add(ParagraphStyle(
    name="BodyArmX", fontName=REGULAR, fontSize=10, leading=15,
    textColor=MUTED, spaceAfter=7,
))
styles.add(ParagraphStyle(
    name="SmallArmX", fontName=REGULAR, fontSize=8.5, leading=12,
    textColor=DIM, spaceAfter=4,
))
styles.add(ParagraphStyle(
    name="CardTitle", fontName=SEMIBOLD, fontSize=11, leading=14,
    textColor=TEXT, spaceAfter=4,
))
styles.add(ParagraphStyle(
    name="CardBody", fontName=REGULAR, fontSize=9, leading=13,
    textColor=MUTED,
))
styles.add(ParagraphStyle(
    name="Number", fontName=BOLD, fontSize=20, leading=23,
    textColor=ORANGE, alignment=TA_CENTER,
))
styles.add(ParagraphStyle(
    name="CenterSmall", parent=styles["SmallArmX"], alignment=TA_CENTER,
))


def p(text, style="BodyArmX"):
    return Paragraph(text, styles[style])


def card(title, body, accent=ORANGE, width=160 * mm):
    content = [[p(title, "CardTitle")], [p(body, "CardBody")]]
    table = Table(content, colWidths=[width])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SURFACE),
        ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#343A32")),
        ("LINEBEFORE", (0, 0), (0, -1), 3, accent),
        ("LEFTPADDING", (0, 0), (-1, -1), 13),
        ("RIGHTPADDING", (0, 0), (-1, -1), 13),
        ("TOPPADDING", (0, 0), (-1, -1), 11),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 11),
    ]))
    return table


def three_cards(items):
    tables = [card(title, body, accent, 49 * mm) for title, body, accent in items]
    table = Table([tables], colWidths=[53 * mm, 53 * mm, 53 * mm], hAlign="LEFT")
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return table


def numbered_step(number, title, body):
    left = Table([[p(str(number), "Number")]], colWidths=[17 * mm], rowHeights=[17 * mm])
    left.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#38251F")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#714031")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    right = [p(title, "CardTitle"), p(body, "CardBody")]
    table = Table([[left, right]], colWidths=[21 * mm, 140 * mm])
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return table


def checklist(rows):
    data = []
    for label, detail, done in rows:
        mark = "OK" if done else "NEXT"
        color = MINT if done else ORANGE
        data.append([p(f"<font color='{color.hexval()}'><b>{mark}</b></font>", "SmallArmX"), p(f"<b>{label}</b><br/>{detail}", "CardBody")])
    table = Table(data, colWidths=[19 * mm, 142 * mm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SURFACE),
        ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#343A32")),
        ("INNERGRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#30362F")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 11),
        ("RIGHTPADDING", (0, 0), (-1, -1), 11),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    return table


def draw_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BG)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setStrokeColor(colors.HexColor("#2E352E"))
    canvas.setLineWidth(0.5)
    canvas.line(18 * mm, PAGE_H - 18 * mm, PAGE_W - 18 * mm, PAGE_H - 18 * mm)
    canvas.setFillColor(ORANGE)
    canvas.circle(22 * mm, PAGE_H - 13 * mm, 2.2 * mm, fill=1, stroke=0)
    canvas.setFont(SEMIBOLD, 8)
    canvas.setFillColor(TEXT)
    canvas.drawString(28 * mm, PAGE_H - 14.2 * mm, "ArmX")
    canvas.setFillColor(DIM)
    canvas.drawRightString(PAGE_W - 18 * mm, PAGE_H - 14.2 * mm, "GUIDE UTILISATEUR / V1")
    canvas.setStrokeColor(colors.HexColor("#2E352E"))
    canvas.line(18 * mm, 16 * mm, PAGE_W - 18 * mm, 16 * mm)
    canvas.setFont(REGULAR, 7.5)
    canvas.setFillColor(DIM)
    canvas.drawString(18 * mm, 10.5 * mm, "Local par défaut. Tes séances restent sur ton appareil.")
    canvas.drawRightString(PAGE_W - 18 * mm, 10.5 * mm, f"{doc.page:02d}")
    canvas.restoreState()


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    frame = Frame(24 * mm, 23 * mm, PAGE_W - 48 * mm, PAGE_H - 48 * mm, id="normal")
    doc = BaseDocTemplate(str(OUTPUT), pagesize=A4, leftMargin=24 * mm, rightMargin=24 * mm, topMargin=25 * mm, bottomMargin=23 * mm)
    doc.addPageTemplates([PageTemplate(id="ArmX", frames=frame, onPage=draw_page)])

    story = []
    story += [Spacer(1, 26 * mm), p("ARMX / GUIDE UTILISATEUR", "Kicker"), p("Une séance.<br/>Un geste.<br/>Un historique.", "CoverTitle"), p("Le carnet d'entraînement des avant-bras qui reste rapide, local et prêt quand tu l'es.", "CoverLead")]
    story += [card("V1 / MVP prêt", "Une expérience complète pour choisir un mouvement, compter tes répétitions, valider tes séries et retrouver tes séances.", ORANGE, 161 * mm), Spacer(1, 14 * mm)]
    story += [p("La promesse ArmX", "H2ArmX"), p("Tu ouvres l'app, tu sais quoi faire. Aucun compte, aucun flux social, aucune distraction. L'essentiel est là pour une séance sérieuse, même sans connexion.", "BodyArmX"), Spacer(1, 7 * mm)]
    story += [three_cards([
        ("Hors-ligne", "Le parcours principal reste utilisable sans réseau.", ORANGE),
        ("Local", "Tes séances sont gardées dans le stockage de ton appareil.", MINT),
        ("Sans friction", "De gros contrôles, des retours immédiats, une navigation courte.", ORANGE),
    ]), Spacer(1, 18 * mm), p("Version du guide: 21 septembre 2026", "SmallArmX"), PageBreak()]

    story += [p("01 / PREMIERS PAS", "Kicker"), p("Commencer en moins d'une minute", "H1ArmX"), p("Le meilleur point de départ est l'écran Aujourd'hui. Il rassemble ton focus, tes mouvements et ton rythme récent.", "BodyArmX"), Spacer(1, 6 * mm)]
    story += [numbered_step(1, "Ouvre Aujourd'hui", "Le statut Prêt hors-ligne confirme que l'app peut rester utile sans connexion.")]
    story += [numbered_step(2, "Choisis un mouvement", "Flexions du poignet, Extensions du poignet ou Farmer hold. Chaque carte indique la cible de séries et de répétitions.")]
    story += [numbered_step(3, "Commence la séance", "Le bouton Commencer ouvre un espace dédié, sans quitter ton rythme.")]
    story += [numbered_step(4, "Compte chaque répétition", "Appuie sur le grand +1. Sur ordinateur, la touche Espace ajoute aussi une répétition.")]
    story += [numbered_step(5, "Valide puis termine", "Quand la cible est atteinte, valide la série. A la dernière série, Terminer enregistre automatiquement la séance dans Historique.")]
    story += [Spacer(1, 10 * mm), p("Le repère important", "H2ArmX"), card("Ne cherche pas plus loin", "La carte Focus du jour te donne le point d'entrée. Les trois cartes de mouvements sont toujours disponibles juste en dessous.", MINT, 161 * mm), PageBreak()]

    story += [p("02 / PENDANT LA SÉANCE", "Kicker"), p("Un compteur qui répond à ton geste", "H1ArmX"), p("ArmX garde l'attention sur le mouvement: une cible lisible, un compteur central, un retour visuel immédiat.", "BodyArmX"), Spacer(1, 6 * mm)]
    story += [three_cards([
        ("+1", "Ajoute une répétition. Le cercle et le compteur avancent ensemble.", ORANGE),
        ("Série suivante", "Valide uniquement quand la cible de la série est atteinte.", MINT),
        ("Quitter", "Ferme la séance sans enregistrer une session incomplète.", ORANGE),
    ]), Spacer(1, 12 * mm)]
    story += [p("Ce que tu vois", "H2ArmX"), checklist([
        ("Série 1 / 3", "Ta position actuelle dans le mouvement.", True),
        ("Progression", "La barre et le cercle visualisent le chemin vers la cible.", True),
        ("Minuterie", "Le temps écoulé reste visible sans prendre la place du compteur.", True),
        ("Feedback", "Chaque +1 pulse légèrement; les animations se réduisent si ton appareil le demande.", True),
    ]), Spacer(1, 12 * mm), card("Une séance terminée est une donnée utile", "A la fin, ArmX enregistre l'exercice, la date, les séries, les répétitions et la durée. Tu retrouves immédiatement le résultat dans Historique.", MINT, 161 * mm), PageBreak()]

    story += [p("03 / TON JOURNAL", "Kicker"), p("Retrouver, exporter, garder le contrôle", "H1ArmX"), p("Le journal est conçu pour être consulté rapidement et emporté quand tu le souhaites.", "BodyArmX"), Spacer(1, 6 * mm)]
    story += [card("Historique", "Retrouve chaque séance par mouvement, date, répétitions, séries et durée. Le graphique des sept derniers jours te donne un signal simple de régularité.", ORANGE, 161 * mm), Spacer(1, 8 * mm), card("Réglages", "Exporte ton journal en JSON pour une sauvegarde complète ou en CSV pour l'ouvrir dans un tableur. L'import JSON vérifie le format avant toute écriture.", MINT, 161 * mm), Spacer(1, 8 * mm), card("Thème", "Passe du thème sombre au thème clair selon ton environnement. Le choix est mémorisé localement.", ORANGE, 161 * mm), Spacer(1, 12 * mm)]
    story += [p("Données et confidentialité", "H2ArmX"), p("ArmX ne demande pas de compte et n'envoie pas ton historique vers un serveur. Comme toute donnée stockée dans le navigateur, ton journal dépend de la sécurité de ton appareil. Utilise l'export JSON si tu veux conserver une copie indépendante.", "BodyArmX"), PageBreak()]

    story += [p("04 / V1", "Kicker"), p("Ce qui est prêt aujourd'hui", "H1ArmX"), p("La V1 couvre la boucle d'entraînement locale. Les prochaines étapes sont des preuves de release et du déploiement, pas des fonctionnalités essentielles manquantes.", "BodyArmX"), Spacer(1, 6 * mm)]
    story += [checklist([
        ("Boucle workout", "Choisir un mouvement, compter, valider les séries, enregistrer la séance.", True),
        ("Historique", "Consulter les séances et la régularité sur sept jours.", True),
        ("Offline", "Manifest, service worker et stockage local IndexedDB.", True),
        ("Export", "JSON versionné et CSV, import contrôlé.", True),
        ("Interface", "Mobile-first, responsive, focus clavier, safe-area et reduced motion.", True),
        ("Preuves restantes", "Test iPhone réel hors-ligne, Playwright/E2E, Lighthouse et déploiement.", False),
    ]), Spacer(1, 14 * mm), card("Statut honnête", "MVP fonctionnel: 96%. Projet de release: 88%. Le dépôt public, les tests locaux et la CI GitHub sont prêts; les preuves appareil réel et la mise en ligne restent séparées pour éviter une fausse promesse.", ORANGE, 161 * mm), Spacer(1, 14 * mm), p("Projet public: github.com/theoperson/ArmxX", "CenterSmall")]

    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build()
