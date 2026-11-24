const { presentation } = require('../../utils/avatar-presentation');
Component({
  properties: { layers: { type: Array, value: [], observer(value) { this.setData(presentation(value)); } } },
  data: { renderImage: '/assets/wardrobe-v38/base.png' }
});
