import React, { useEffect, useMemo, useState } from "react";

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

function formatDate(date) {
  if (!date) return "Data não definida";

  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function getPartnerName(partner) {
  return partner?.name || partner?.company || "Parceiro sem nome";
}

export default function RelationshipTimeline({ partners = [], focusPartner }) {
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
          <p className="aurora-eyebrow">História da parceria</p>

          <h2>Relationship Timeline</h2>

          <p>
            Consulte e atualize toda a evolução da relação empresarial.
          </p>
        </div>

        <div className="timeline-controls">
          <label>
            <span>Parceiro em análise</span>

            <select
              value={selectedPartner}
              onChange={(event) =>
                setSelectedPartner(event.target.value)
              }
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
            {isAdding ? "Cancelar" : "+ Novo acontecimento"}
          </button>
        </div>
      </header>

      <div className="timeline-partner-summary">
        <div>
          <small>Dossiê empresarial</small>
          <strong>{selectedPartner}</strong>
        </div>

        <span>
          {currentTimeline.length}{" "}
          {currentTimeline.length === 1
            ? "acontecimento registado"
            : "acontecimentos registados"}
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
                Atualizar a memória empresarial
              </p>
              <h3>Novo acontecimento</h3>
            </div>
          </div>

          <div className="timeline-form-grid">
            <label>
              <span>Data</span>
              <input
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleNewEventChange}
              />
            </label>

            <label>
              <span>Categoria</span>
              <select
                name="category"
                value={newEvent.category}
                onChange={handleNewEventChange}
              >
                <option>Comercial</option>
                <option>Reunião</option>
                <option>Negociação</option>
                <option>Contrato</option>
                <option>Operações</option>
                <option>Financeiro</option>
                <option>Marketing</option>
                <option>ESG</option>
                <option>Internacionalização</option>
                <option>Performance</option>
              </select>
            </label>

            <label className="timeline-form-wide">
              <span>Título</span>
              <input
                type="text"
                name="title"
                placeholder="Ex.: Renovação do contrato"
                value={newEvent.title}
                onChange={handleNewEventChange}
              />
            </label>

            <label className="timeline-form-wide">
              <span>Descrição</span>
              <textarea
                name="description"
                rows="4"
                placeholder="Registe o que aconteceu e por que foi importante."
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
              Cancelar
            </button>

            <button type="submit">
              Guardar acontecimento
            </button>
          </div>
        </form>
      )}

      <div className="timeline">
        {currentTimeline.length === 0 ? (
          <div className="timeline-empty">
            <strong>Ainda não existem acontecimentos registados.</strong>

            <p>
              Adicione o primeiro momento da história de{" "}
              {selectedPartner}.
            </p>

            <button
              type="button"
              onClick={() => setIsAdding(true)}
            >
              + Registar primeiro acontecimento
            </button>
          </div>
        ) : (
          currentTimeline.map((event, index) => (
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
                    <small>{formatDate(event.date)}</small>
                    <h3>{event.title}</h3>
                  </div>

                  <button
                    type="button"
                    className="timeline-delete-button"
                    onClick={() =>
                      removeTimelineEvent(event.id)
                    }
                    aria-label={`Eliminar ${event.title}`}
                    title="Eliminar acontecimento"
                  >
                    ×
                  </button>
                </div>

                <span>{event.category}</span>
                <p>{event.description}</p>
              </div>
            </article>
          ))
        )}
      </div>

      <footer className="timeline-intelligence-footer">
        <span>N</span>

        <div>
          <small>Memória empresarial preservada por</small>
          <strong>NEXA360 Intelligence</strong>
        </div>
      </footer>
    </section>
  );
}
