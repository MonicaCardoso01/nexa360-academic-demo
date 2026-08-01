import React, { useEffect, useMemo, useState } from "react";
import BrandSymbol from "./BrandSymbol.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { timelineEventTranslations } from "../i18n/timelineEventTranslations.js";

const INITIAL_TIMELINES = {
  "NordWerk GmbH": [
    {
      id: "nordwerk-1",
      date: "2026-01-15",
      icon: "●",
      title: "Primeiro contacto",
      description:
        "Primeiro contacto realizado durante uma feira internacional.",
      category: "Comercial",
    },
    {
      id: "nordwerk-2",
      date: "2026-01-22",
      icon: "◆",
      title: "Primeira reunião",
      description:
        "Reunião online para apresentação da empresa e levantamento das necessidades.",
      category: "Reunião",
    },
    {
      id: "nordwerk-3",
      date: "2026-02-05",
      icon: "▣",
      title: "Proposta enviada",
      description: "Envio de uma proposta comercial personalizada.",
      category: "Negociação",
    },
    {
      id: "nordwerk-4",
      date: "2026-02-18",
      icon: "✓",
      title: "Contrato assinado",
      description: "Contrato anual aprovado pelo parceiro.",
      category: "Contrato",
    },
    {
      id: "nordwerk-5",
      date: "2026-03-12",
      icon: "□",
      title: "Primeira entrega",
      description: "Entrega realizada dentro do prazo previsto.",
      category: "Operações",
    },
    {
      id: "nordwerk-6",
      date: "2026-05-15",
      icon: "↗",
      title: "Crescimento da parceria",
      description: "O volume de compras aumentou 18%.",
      category: "Performance",
    },
  ],

  "Atlântico Export": [
    {
      id: "atlantico-1",
      date: "2026-02-03",
      icon: "●",
      title: "Primeiro contacto",
      description:
        "Contacto inicial realizado através de uma recomendação empresarial.",
      category: "Comercial",
    },
    {
      id: "atlantico-2",
      date: "2026-02-17",
      icon: "◆",
      title: "Reunião presencial",
      description:
        "Apresentação dos serviços e identificação de oportunidades internacionais.",
      category: "Reunião",
    },
    {
      id: "atlantico-3",
      date: "2026-03-08",
      icon: "▣",
      title: "Proposta em análise",
      description:
        "Proposta de acompanhamento comercial enviada à direção.",
      category: "Negociação",
    },
  ],

  "Lumière Conseil": [
    {
      id: "lumiere-1",
      date: "2026-03-10",
      icon: "●",
      title: "Contacto através do LinkedIn",
      description:
        "Primeira aproximação realizada com a responsável comercial.",
      category: "Comercial",
    },
    {
      id: "lumiere-2",
      date: "2026-03-24",
      icon: "◆",
      title: "Reunião por Teams",
      description:
        "Análise das necessidades de consultoria e internacionalização.",
      category: "Reunião",
    },
    {
      id: "lumiere-3",
      date: "2026-04-15",
      icon: "✓",
      title: "Projeto aprovado",
      description:
        "Aprovado o projeto de consultoria para expansão no mercado português.",
      category: "Contrato",
    },
  ],

  "Iberia Green Foods": [
    {
      id: "iberia-1",
      date: "2026-04-02",
      icon: "●",
      title: "Prospecção comercial",
      description:
        "Empresa identificada como potencial parceira no setor alimentar.",
      category: "Comercial",
    },
    {
      id: "iberia-2",
      date: "2026-04-19",
      icon: "◆",
      title: "Reunião exploratória",
      description:
        "Discussão sobre canais de distribuição em Portugal e Espanha.",
      category: "Reunião",
    },
  ],

  "Bella Forma SRL": [
    {
      id: "bella-1",
      date: "2026-05-06",
      icon: "●",
      title: "Primeiro contacto",
      description:
        "Apresentação institucional enviada à empresa italiana.",
      category: "Comercial",
    },
  ],
};

const EMPTY_EVENT = {
  date: "",
  title: "",
  category: "Comercial",
  description: "",
};

function formatDate(date, locale) {
  if (!date) return "Data não definida";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function getPartnerName(partner) {
  return partner?.name || partner?.company || "Parceiro sem nome";
}

export default function RelationshipTimeline({ partners = [], focusPartner, onPartnerChange }) {
  const { t, language, locale } = useLanguage();
  const partnerNames = useMemo(() => {
    const names = partners
      .map(getPartnerName)
      .filter(Boolean);

    return [...new Set(names)];
  }, [partners]);

  const initialPartner =
    partnerNames.find((name) => name === "NordWerk GmbH") ||
    partnerNames[0] ||
    "NordWerk GmbH";

  const [selectedPartner, setSelectedPartner] = useState(initialPartner);
  const [timelines, setTimelines] = useState(() => {
    try {
      const saved = localStorage.getItem("nexa360-partner-timelines");

      return saved ? JSON.parse(saved) : INITIAL_TIMELINES;
    } catch {
      return INITIAL_TIMELINES;
    }
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState(EMPTY_EVENT);

  useEffect(() => {
    localStorage.setItem(
      "nexa360-partner-timelines",
      JSON.stringify(timelines)
    );
  }, [timelines]);

  useEffect(() => {
    if (
      partnerNames.length > 0 &&
      !partnerNames.includes(selectedPartner)
    ) {
      setSelectedPartner(partnerNames[0]);
    }
  }, [partnerNames, selectedPartner]);

  const currentTimeline = useMemo(() => {
    return [...(timelines[selectedPartner] || [])].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [timelines, selectedPartner]);

  function handleNewEventChange(event) {
    const { name, value } = event.target;

    setNewEvent((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function addTimelineEvent(event) {
    event.preventDefault();

    if (
      !newEvent.date ||
      !newEvent.title.trim() ||
      !newEvent.description.trim()
    ) {
      window.alert(
        "Preencha a data, o título e a descrição do acontecimento."
      );
      return;
    }

    const timelineEvent = {
      ...newEvent,
      id: `${selectedPartner}-${Date.now()}`,
      icon: "●",
      title: newEvent.title.trim(),
      description: newEvent.description.trim(),
    };

    setTimelines((current) => ({
      ...current,
      [selectedPartner]: [
        ...(current[selectedPartner] || []),
        timelineEvent,
      ],
    }));

    setNewEvent(EMPTY_EVENT);
    setIsAdding(false);
  }

  function removeTimelineEvent(eventId) {
    const confirmed = window.confirm(
      "Pretende eliminar este acontecimento da história da parceria?"
    );

    if (!confirmed) return;

    setTimelines((current) => ({
      ...current,
      [selectedPartner]: (current[selectedPartner] || []).filter(
        (item) => item.id !== eventId
      ),
    }));
  }

  const availablePartners = useMemo(
    () =>
      partnerNames.length > 0
        ? partnerNames
        : Object.keys(INITIAL_TIMELINES),
    [partnerNames]
  );

  useEffect(() => {
    if (focusPartner && availablePartners.includes(focusPartner)) {
      setSelectedPartner(focusPartner);
    }
  }, [focusPartner, availablePartners]);

  return (
    <section className="timeline-panel" id="relationship-plan">
      <header className="timeline-header">
        <div>
          <p className="aurora-eyebrow">{t("relationship.history")}</p>

          <h2>{t("relationship.timeline")}</h2>

          <p>{t("relationship.timelineText")}</p>
        </div>

        <div className="timeline-controls">
          <label>
            <span>{t("relationship.partnerAnalysis")}</span>

            <select
              value={selectedPartner}
              onChange={(event) => {
                setSelectedPartner(event.target.value);
                onPartnerChange?.(event.target.value);
              }}
            >
              {availablePartners.map((name) => (
                <option value={name} key={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="timeline-add-button"
            onClick={() => setIsAdding((current) => !current)}
          >
            {isAdding ? t("relationship.cancel") : t("relationship.addEvent")}
          </button>
        </div>
      </header>

      <div className="timeline-partner-summary">
        <div>
          <small>{t("relationship.businessFile")}</small>
          <strong>{selectedPartner}</strong>
        </div>

        <span>
          {t(currentTimeline.length===1?"relationship.oneEvent":"relationship.events",{count:currentTimeline.length})}
        </span>
      </div>

      {isAdding && (
        <form
          className="timeline-event-form"
          onSubmit={addTimelineEvent}
        >
          <div className="timeline-form-heading">
            <div>
              <p className="aurora-eyebrow">
                {t("relationship.updateMemory")}
              </p>
              <h3>{t("relationship.newEvent")}</h3>
            </div>
          </div>

          <div className="timeline-form-grid">
            <label>
              <span>{t("relationship.date")}</span>
              <input
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleNewEventChange}
              />
            </label>

            <label>
              <span>{t("relationship.category")}</span>
              <select
                name="category"
                value={newEvent.category}
                onChange={handleNewEventChange}
              >
                {["Comercial","Reunião","Negociação","Contrato","Operações","Financeiro","Marketing","ESG","Internacionalização","Performance"].map((category) => (
                  <option key={category} value={category}>{t(`relationship.categories.${category}`)}</option>
                ))}
              </select>
            </label>

            <label className="timeline-form-wide">
              <span>{t("relationship.eventTitle")}</span>
              <input
                type="text"
                name="title"
                placeholder={t("relationship.titlePlaceholder")}
                value={newEvent.title}
                onChange={handleNewEventChange}
              />
            </label>

            <label className="timeline-form-wide">
              <span>{t("relationship.description")}</span>
              <textarea
                name="description"
                rows="4"
                placeholder={t("relationship.descriptionPlaceholder")}
                value={newEvent.description}
                onChange={handleNewEventChange}
              />
            </label>
          </div>

          <div className="timeline-form-actions">
            <button
              type="button"
              onClick={() => {
                setNewEvent(EMPTY_EVENT);
                setIsAdding(false);
              }}
            >
              {t("relationship.cancel")}
            </button>

            <button type="submit">
              {t("relationship.saveEvent")}
            </button>
          </div>
        </form>
      )}

      <div className="timeline">
        {currentTimeline.length === 0 ? (
          <div className="timeline-empty">
            <strong>{t("relationship.noEvents")}</strong>

            <p>
              {t("relationship.addFirst",{partner:selectedPartner})}
            </p>

            <button
              type="button"
              onClick={() => setIsAdding(true)}
            >
              {t("relationship.registerFirst")}
            </button>
          </div>
        ) : (
          currentTimeline.map((event, index) => {
            const translatedEvent = timelineEventTranslations[language]?.[event.id];
            const eventTitle = translatedEvent?.[0] || event.title;
            const eventDescription = translatedEvent?.[1] || event.description;
            return (
            <article className="timeline-item" key={event.id}>
              <div className="timeline-left">
                <div className="timeline-icon">
                  {event.icon || "●"}
                </div>

                {index !== currentTimeline.length - 1 && (
                  <div className="timeline-line" />
                )}
              </div>

              <div className="timeline-card">
                <div className="timeline-card-top">
                  <div>
                    <small>{formatDate(event.date, locale)}</small>
                    <h3>{eventTitle}</h3>
                  </div>

                  <button
                    type="button"
                    className="timeline-delete-button"
                    onClick={() =>
                      removeTimelineEvent(event.id)
                    }
                    aria-label={`${t("relationship.deleteEvent")} ${eventTitle}`}
                    title={t("relationship.deleteEvent")}
                  >
                    ×
                  </button>
                </div>

                <span>{t(`relationship.categories.${event.category}`)}</span>
                <p>{eventDescription}</p>
              </div>
            </article>
            );
          })
        )}
      </div>

      <footer className="timeline-intelligence-footer">
        <BrandSymbol className="timeline-brand-symbol" />

        <div>
          <small>{t("relationship.memory")}</small>
          <strong>NEXA360 Intelligence</strong>
        </div>
      </footer>
    </section>
  );
}
