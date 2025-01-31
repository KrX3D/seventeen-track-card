class SeventeenTrackCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }
    this.config = config;
  }

  getCardSize() {
    return 3;
  }

  set hass(hass) {
    const entityId = this.config.entity;
    const state = hass.states[entityId];
    const packages = state.attributes.packages != null ? state.attributes.packages : [];
	
     // Sort packages by timestamp in descending order
	  packages.sort((a, b) => {
		const timestampA = new Date(a.timestamp).getTime();
		const timestampB = new Date(b.timestamp).getTime();
		return timestampB - timestampA;
	  });

    if (!this.content) {
      const card = document.createElement('ha-card');
      const style = document.createElement('style');
      this.content = document.createElement('div');

      card.header = this.config.title != null ? this.config.title : '17Track.net';
      style.textContent = `
        table {
          width: 100%;
          padding: 0 15px 15px 15px;
        }
        thead th {
          text-align: left;
        }
        tbody tr:nth-child(odd) {
          background-color: var(--paper-card-background-color);
        }
        tbody tr:nth-child(even) {
          background-color: var(--secondary-background-color);
        }
    	/* Add the style for separating rows here */
    	tbody tr:not(:last-child) {
      	box-shadow: 0 1px 0 0 var(--primary-color);
    	}
        td a {
          color: var(--primary-text-color);
          font-weight: normal;
        }
      `;

      card.appendChild(this.content);
      this.appendChild(style);
      this.appendChild(card);
    }

    const content = `
      ${packages.map(elem => `
          <tr>
            <td>
              <a href="https://17track.net/en/track#nums=${elem.tracking_number}" target='_blank'>
                ${elem.friendly_name != null && elem.friendly_name != '' ? elem.friendly_name : elem.tracking_number}
              </a>
            </td>
            <td>${elem.info_text != null && elem.info_text != '' ? elem.info_text : []}</td>
            <td>${elem.timestamp != null && elem.timestamp != '' ? elem.timestamp.slice(0, -9).replace("T", " ") : []}</td>
      `).join('')}
    `;

    this.content.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th style="width:25%">Last Update</th>
          </tr>
        </thead>
      <tbody>
        ${content}
      </tbody>
      </table>
    `;
  }
}

customElements.define('seventeen-track-card', SeventeenTrackCard);
