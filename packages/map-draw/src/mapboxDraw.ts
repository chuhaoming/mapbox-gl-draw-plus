import {
  Map, IControl, AnyLayer, LineLayer, Source, AnySourceImpl,
} from 'mapbox-gl';
import {
  deepClone, SourceIds, IDMAX, MetaType,
} from '@chmpr/utils';
import { Feature, FeatureCollection, Geometry } from 'geojson';
import { uid } from 'uid';
import { DrawMapEvent } from './DrawMapEvent';
import { theme } from './styles/theme';
import { UserAction } from './action';
import { ModeObject } from './modes/modeObject';
import { DrawGeometryType, EventOptions } from './types';
import { MapFeature } from './mapFeature';
import { DrawRender } from './DrawRender';
import { Cursor } from './cursor';

export class MapboxDraw {
  map: Map;

  styles: AnyLayer[];

  private event: DrawMapEvent;

  private defaultOptions = {
    // defaultMode: Constants.modes.SIMPLE_SELECT,
    keybindings: true,
    // touchEnabled: true,
    // clickBuffer: 2,
    // touchBuffer: 25,
    // boxSelect: true,
    // displayControlsDefault: true,
    // styles,
    // modes,
    // controls: {},
    // userProperties: false,
  };

  hotSource!: AnySourceImpl;

  constructor(opt: EventOptions) {
    this.map = opt.map;
    const option = Object.assign(this.defaultOptions, opt);
    this.event = new DrawMapEvent(option);
    this.event.addEventListeners();
    this.handleMapLayer();
  }

  private handleMapLayer() {
    const hot = this.addLayerBySourceBucket('hot');
    const cold = this.addLayerBySourceBucket('cold');
    this.styles = hot.concat(cold);
    this.map.on('load', () => {
      this.addSource();
      this.addLayer();
      Cursor.getInstance();
      Cursor.cursor.setMap(this.map);
      DrawRender.getInstance();
      DrawRender.drawRender.setMap(this.map);
    });
  }
  // onAdd(map: Map): HTMLElement {
  // }

  // onRemove(map: Map): void {
  //   throw new Error('Method not implemented.');
  // }

  private addSource() {
    Object.values(SourceIds).forEach((key) => {
      this.map.addSource(key, {
        data: {
          type: 'FeatureCollection',
          features: [],
        },
        type: 'geojson',
      });
    });
  }

  private addLayer() {
    UserAction.getInstance().layerIdList = this.styles.map((style) => {
      this.map.addLayer(style);
      return style.id;
    });
  }

  private addLayerBySourceBucket(sourceBucket: string) {
    const curTheme = deepClone<typeof theme>(theme);
    return curTheme.map((t) => {
      const style = Object.assign(t, {
        id: `${t.id}.${sourceBucket}`,
        source: (sourceBucket === 'hot') ? SourceIds.HOT : SourceIds.COLD,
      });
      return style as AnyLayer;
    });
  }

  changeMode(mode: ModeObject) {
    this.event.setMode<ModeObject>(mode);
  }

  setProperties(properties: any): void | DrawGeometryType {
    if (!MapFeature.SelectedHotGeometryList.length) {
      return console.error('please select geometry ');
    }
    const curGeo = MapFeature.SelectedHotGeometryList.find((l) => l.id);
    if (curGeo) curGeo.properties = properties;
    DrawRender.drawRender.run();
    return curGeo;
  }

  setProperty(key: string, val: string): void | DrawGeometryType {
    if (!MapFeature.SelectedHotGeometryList.length) {
      return console.error('please select geometry ');
    }
    const curGeo = MapFeature.SelectedHotGeometryList.find((l) => l.id);
    if (curGeo) {
      curGeo.properties = curGeo.properties || {};
      curGeo.properties[key] = val;
    }
    DrawRender.drawRender.run();
    return curGeo;
  }

  getAllFeatures() {
    return MapFeature.getPureFeatureList([...MapFeature.DrawColdGeometryList, ...MapFeature.SelectedHotGeometryList].filter((e) => e.id));
  }

  getSelectedFeature() {
    const list = MapFeature.getPureFeatureList(MapFeature.SelectedHotGeometryList.filter((e) => e.id)) || [];
    return list[0];
  }

  deleteSelectedFeature() {
    MapFeature.SelectedHotGeometryList = [];
    DrawRender.drawRender?.run();
  }

  addGeojson(geojson: {
    type: string;
    features: any[];
  }): void {
    const list = geojson.features.map((feature: any) => ({
      id: uid(IDMAX),
      meta: 'feature',
      active: 'cold',
      type: feature.geometry.type,
      properties: feature.properties,
      coordinates: feature.geometry.coordinates,
    }));

    MapFeature.DrawColdGeometryList.push(...list);
    DrawRender.drawRender.run();
  }
}
export default MapboxDraw;
