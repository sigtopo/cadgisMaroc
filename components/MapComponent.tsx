import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { GEOJSON_URL, PROVINCE_TO_REGION, DOWNLOAD_LINKS, ARABIC_PROVINCES } from '../constants';
import { BaseMapType } from '../types';

declare var ol: any;

interface MapComponentProps {
  selectedProvince: string | null;
  onProvinceClick: (name: string | null) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ selectedProvince, onProvinceClick }) => {
  const mapElement = useRef<HTMLDivElement>(null);
  const popupElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const overlayRef = useRef<any>(null);
  const vectorSourceRef = useRef<any>(null);
  const vectorLayerRef = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);
  
  const [baseMap, setBaseMap] = useState<BaseMapType>('OSM');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isCoordToolExpanded, setIsCoordToolExpanded] = useState(false);
  const [coordInputMode, setCoordInputMode] = useState<'meters' | 'degrees'>('degrees');
  const [inputX, setInputX] = useState('');
  const [inputY, setInputY] = useState('');
  const [coords, setCoords] = useState({ lat: 0, lon: 0 });
  const [isLayersExpanded, setIsLayersExpanded] = useState(false);

  const allProvinces = useMemo(() => Object.keys(PROVINCE_TO_REGION), []);

  const getProvinceName = useCallback((feature: any) => {
    const props = feature.getProperties();
    const possibleKeys = ["NOM-PROV", "NOM_PROV", "name", "NAME", "nom", "Nom", "الاقليم", "الإقليم"];
    for (let key of possibleKeys) {
      if (props[key]) return props[key].toString().toUpperCase().trim();
    }
    return null;
  }, []);

  const handleDemander = useCallback(() => {
    if (!selectedProvince) return;
    const paymentUrl = `/?page=payment&province=${encodeURIComponent(selectedProvince)}`;
    window.location.href = paymentUrl;
  }, [selectedProvince]);

  const zoomToProvince = useCallback((provinceName: string) => {
    if (!mapRef.current || !vectorSourceRef.current || !overlayRef.current) return;

    const source = vectorSourceRef.current;
    const features = source.getFeatures();
    
    const feature = features.find((f: any) => {
      const name = getProvinceName(f);
      return name === provinceName.toUpperCase().trim();
    });

    if (feature) {
      const geometry = feature.getGeometry();
      const extent = geometry.getExtent();
      const center = ol.extent.getCenter(extent);
      
      overlayRef.current.setPosition(center);
      
      mapRef.current.getView().fit(extent, { 
        duration: 1200, 
        padding: [100, 100, 100, 100],
        maxZoom: 12,
        easing: ol.easing.easeOut
      });
    }
  }, [getProvinceName]);

  // Initial Map Setup (Once)
  useEffect(() => {
    if (!mapElement.current || !popupElement.current || mapRef.current) return;

    const vectorSource = new ol.source.Vector({
      url: GEOJSON_URL,
      format: new ol.format.GeoJSON()
    });
    vectorSourceRef.current = vectorSource;

    const vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: (feature: any) => {
        const name = getProvinceName(feature);
        const isSelected = name === selectedProvince?.toUpperCase().trim();
        const hasDownload = name ? !!DOWNLOAD_LINKS[name] : false;

        let fillColor = hasDownload ? "rgba(34, 197, 94, 0.18)" : "rgba(239, 68, 68, 0.18)";
        let strokeColor = "rgba(30, 41, 59, 0.5)";
        let strokeWidth = 1;

        if (isSelected) {
          fillColor = "rgba(37, 99, 235, 0.35)";
          strokeWidth = 3;
          strokeColor = "#2563eb";
        }
        
        return new ol.style.Style({
          stroke: new ol.style.Stroke({ color: strokeColor, width: strokeWidth }),
          fill: new ol.style.Fill({ color: fillColor }),
          text: new ol.style.Text({
            text: name || "", 
            font: isSelected ? "900 13px 'Inter', sans-serif" : "bold 9px 'Inter', sans-serif",
            fill: new ol.style.Fill({ color: isSelected ? "#1e40af" : "#475569" }),
            stroke: new ol.style.Stroke({ color: "#ffffff", width: 2.5 }),
            overflow: true,
            placement: 'point'
          })
        });
      }
    });
    vectorLayerRef.current = vectorLayer;

    // Marker Layer for GoTo function
    const markerSource = new ol.source.Vector();
    const markerLayer = new ol.layer.Vector({
      source: markerSource,
      style: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          scale: 0.06
        })
      })
    });
    markerLayerRef.current = markerLayer;

    const osmLayer = new ol.layer.Tile({ source: new ol.source.OSM(), visible: true, name: 'OSM' });
    const satelliteLayer = new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      }),
      visible: false,
      name: 'Satellite'
    });
    const terrainLayer = new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: "https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      }),
      visible: false,
      name: 'Terrain'
    });

    const overlay = new ol.Overlay({
      element: popupElement.current,
      autoPan: { animation: { duration: 250 } },
      positioning: 'bottom-center',
      stopEvent: true,
      offset: [0, -15]
    });
    overlayRef.current = overlay;

    const map = new ol.Map({
      target: mapElement.current,
      layers: [osmLayer, satelliteLayer, terrainLayer, vectorLayer, markerLayer],
      overlays: [overlay],
      view: new ol.View({
        center: ol.proj.fromLonLat([-7.09, 31.79]),
        zoom: 6,
        maxZoom: 18,
        minZoom: 5
      })
    });

    mapRef.current = map;

    vectorSource.on('featuresloadend', () => {
      if (selectedProvince) zoomToProvince(selectedProvince);
    });

    map.on("singleclick", (evt: any) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f: any) => f);
      if (feature) {
        const name = getProvinceName(feature);
        if (name) onProvinceClick(name);
      } else {
        onProvinceClick(null);
        overlay.setPosition(undefined);
        markerSource.clear();
      }
    });

    map.on("pointermove", (evt: any) => {
      const coordinate = ol.proj.toLonLat(evt.coordinate);
      setCoords({ lon: coordinate[0], lat: coordinate[1] });
      const pixel = map.getEventPixel(evt.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
    };
  }, []); // Run only once

  // Selection Handler (Reactive)
  useEffect(() => {
    if (!mapRef.current || !vectorLayerRef.current) return;
    
    vectorLayerRef.current.setStyle((feature: any) => {
        const name = getProvinceName(feature);
        const isSelected = name === selectedProvince?.toUpperCase().trim();
        const hasDownload = name ? !!DOWNLOAD_LINKS[name] : false;

        let fillColor = hasDownload ? "rgba(34, 197, 94, 0.18)" : "rgba(239, 68, 68, 0.18)";
        let strokeColor = "rgba(30, 41, 59, 0.5)";
        let strokeWidth = 1;

        if (isSelected) {
          fillColor = "rgba(37, 99, 235, 0.35)";
          strokeWidth = 3;
          strokeColor = "#2563eb";
        }
        
        return new ol.style.Style({
          stroke: new ol.style.Stroke({ color: strokeColor, width: strokeWidth }),
          fill: new ol.style.Fill({ color: fillColor }),
          text: new ol.style.Text({
            text: name || "", 
            font: isSelected ? "900 13px 'Inter', sans-serif" : "bold 9px 'Inter', sans-serif",
            fill: new ol.style.Fill({ color: isSelected ? "#1e40af" : "#475569" }),
            stroke: new ol.style.Stroke({ color: "#ffffff", width: 2.5 }),
            overflow: true,
            placement: 'point'
          })
        });
    });

    if (selectedProvince) {
      zoomToProvince(selectedProvince);
    } else if (overlayRef.current) {
      overlayRef.current.setPosition(undefined);
    }
  }, [selectedProvince, zoomToProvince, getProvinceName]);

  // BaseMap Handler
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.getLayers().getArray().forEach((layer: any) => {
      if (layer instanceof ol.layer.Tile) {
        layer.setVisible(layer.get('name') === baseMap);
      }
    });
  }, [baseMap]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    
    if (q.length === 0) {
      setSuggestions([]);
      return;
    }

    const normalizedQ = q.toLowerCase().trim();
    
    const localMatches = allProvinces
      .filter(p => p.toLowerCase().includes(normalizedQ))
      .map(p => ({ 
        display_name: p, 
        type: 'local',
        province: p
      }));

    setSuggestions(localMatches);

    if (localMatches.length < 3 && q.length >= 3) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + ", Maroc")}&limit=3`);
        const data = await res.json();
        const externalResults = data.map((item: any) => ({
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
          type: 'external'
        }));
        setSuggestions(prev => [...prev, ...externalResults]);
      } catch (err) { 
        console.error(err); 
      }
    }
  };

  const goToLocation = (item: any) => {
    if (!mapRef.current) return;
    
    if (item.type === 'local') {
      onProvinceClick(item.province);
      zoomToProvince(item.province);
    } else {
      const coord = ol.proj.fromLonLat([parseFloat(item.lon), parseFloat(item.lat)]);
      mapRef.current.getView().animate({ center: coord, zoom: 12, duration: 1000 });
      onProvinceClick(null);
    }
    
    setSearchQuery(item.display_name);
    setSuggestions([]);
    setIsSearchExpanded(false);
  };

  const handleGoToCoords = () => {
    if (!mapRef.current || !inputX || !inputY) return;

    let coord;
    const x = parseFloat(inputX);
    const y = parseFloat(inputY);

    if (isNaN(x) || isNaN(y)) return;

    if (coordInputMode === 'degrees') {
      // Input is Lon, Lat
      coord = ol.proj.fromLonLat([x, y]);
    } else {
      // Input is Web Mercator Meters (standard EPSG:3857)
      coord = [x, y];
    }

    const source = markerLayerRef.current.getSource();
    source.clear();
    const feature = new ol.Feature({
      geometry: new ol.geom.Point(coord)
    });
    source.addFeature(feature);

    mapRef.current.getView().animate({ center: coord, zoom: 14, duration: 1200 });
    setIsCoordToolExpanded(false);
  };

  return (
    <div className="w-full h-full relative group/map overflow-hidden bg-slate-200">
      <div ref={mapElement} className="w-full h-full" />
      
      <div 
        ref={popupElement} 
        className={`bg-white shadow-2xl rounded-2xl border border-slate-200 p-6 w-64 z-[500] pointer-events-auto transition-all duration-300 transform origin-bottom ${!selectedProvince ? 'opacity-0 scale-75 translate-y-4 pointer-events-none' : 'opacity-100 scale-100 translate-y-0'}`}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); onProvinceClick(null); }}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <i className="fas fa-times text-[10px]"></i>
        </button>

        <div className="flex flex-col items-center mb-5">
          <div className="w-10 h-1 rounded-full bg-blue-100 mb-4"></div>
          <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight text-center leading-tight">
            {selectedProvince}
          </h4>
          <span className="text-[9px] mt-2 text-blue-600 font-black uppercase tracking-[0.1em] px-3 py-1 bg-blue-50 rounded-full">
            {selectedProvince ? (PROVINCE_TO_REGION[selectedProvince.toUpperCase()] || "Région") : ""}
          </span>
        </div>
        
        <div className="flex justify-center">
          <button 
            onClick={(e) => { e.stopPropagation(); handleDemander(); }}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            Consulter les données
          </button>
        </div>
        
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-slate-200 rotate-45 rounded-sm"></div>
      </div>

      <div className="absolute top-6 right-6 z-[400] flex flex-col items-end gap-3">
        {/* Layer Switcher */}
        <button 
          onClick={() => setIsLayersExpanded(!isLayersExpanded)}
          className="w-14 h-14 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 flex items-center justify-center text-slate-700 hover:text-blue-600 transition-all active:scale-90"
          title="Changer de fond de carte"
        >
          <i className="fas fa-layer-group text-xl"></i>
        </button>
        
        {isLayersExpanded && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col w-36 animate-in fade-in slide-in-from-top-2">
            {(['OSM', 'Satellite', 'Terrain'] as BaseMapType[]).map(type => (
              <button 
                key={type} 
                onClick={() => { setBaseMap(type); setIsLayersExpanded(false); }} 
                className={`px-5 py-3.5 text-[10px] font-black uppercase text-left transition-all ${baseMap === type ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 text-slate-600'}`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        {/* Search Tool */}
        {!isSearchExpanded ? (
          <button 
            onClick={() => setIsSearchExpanded(true)} 
            className="w-14 h-14 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 flex items-center justify-center text-slate-700 hover:text-blue-600 transition-all active:scale-90"
            title="Rechercher"
          >
            <i className="fas fa-search text-xl"></i>
          </button>
        ) : (
          <div className="relative animate-in slide-in-from-right-4 flex flex-col items-end">
            <div className="relative group">
              <input 
                autoFocus 
                type="text" 
                value={searchQuery} 
                onChange={handleSearch} 
                placeholder="Rechercher une ville, province..." 
                className="w-64 md:w-80 pl-10 pr-10 py-4 bg-white border border-slate-200 rounded-2xl shadow-2xl text-[11px] focus:ring-2 focus:ring-blue-500 outline-none font-black uppercase tracking-tighter transition-all" 
              />
              <i className="fas fa-search absolute left-4 top-4.5 text-blue-500 text-sm"></i>
              <button 
                onClick={() => { setIsSearchExpanded(false); setSearchQuery(''); setSuggestions([]); }}
                className="absolute right-3.5 top-4 text-slate-300 hover:text-red-500 transition-colors"
              >
                <i className="fas fa-times-circle text-lg"></i>
              </button>
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute top-full right-0 mt-3 w-full bg-white rounded-2xl shadow-2xl border border-slate-50 overflow-hidden text-[10px] z-[600] animate-in fade-in slide-in-from-top-2">
                {suggestions.map((item, idx) => (
                  <li 
                    key={idx} 
                    onClick={() => goToLocation(item)} 
                    className={`px-5 py-3.5 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 truncate font-black flex items-center gap-3 transition-colors ${item.type === 'local' ? 'text-blue-900' : 'text-slate-600'}`}
                  >
                    {item.type === 'local' ? <i className="fas fa-map-pin text-blue-500"></i> : <i className="fas fa-globe-africa text-slate-400"></i>}
                    {item.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Coordinate Tool Button */}
        <button 
          onClick={() => setIsCoordToolExpanded(!isCoordToolExpanded)}
          className={`w-14 h-14 rounded-2xl shadow-2xl border flex items-center justify-center transition-all active:scale-90 ${isCoordToolExpanded ? 'bg-blue-600 text-white border-blue-700' : 'bg-white/95 backdrop-blur-md text-slate-700 border-white/50 hover:text-blue-600'}`}
          title="Aller aux coordonnées"
        >
          <i className="fas fa-crosshairs text-xl"></i>
        </button>

        {/* Coordinate Input Panel */}
        {isCoordToolExpanded && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-100 p-5 w-72 animate-in fade-in slide-in-from-top-2 text-left">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Saisie de Coordonnées</span>
              <button onClick={() => setIsCoordToolExpanded(false)} className="text-slate-300 hover:text-red-500 transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
              <button 
                onClick={() => setCoordInputMode('degrees')}
                className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${coordInputMode === 'degrees' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
              >
                Degrés
              </button>
              <button 
                onClick={() => setCoordInputMode('meters')}
                className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${coordInputMode === 'meters' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
              >
                Mètres (XY)
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-[8px] font-black uppercase text-slate-400 mb-1 block">
                  {coordInputMode === 'degrees' ? 'Longitude (X)' : 'Abscisse X (Easting)'}
                </label>
                <input 
                  type="text" 
                  value={inputX} 
                  onChange={(e) => setInputX(e.target.value)}
                  placeholder={coordInputMode === 'degrees' ? '-7.09' : '500000'}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-[8px] font-black uppercase text-slate-400 mb-1 block">
                  {coordInputMode === 'degrees' ? 'Latitude (Y)' : 'Ordonnée Y (Northing)'}
                </label>
                <input 
                  type="text" 
                  value={inputY} 
                  onChange={(e) => setInputY(e.target.value)}
                  placeholder={coordInputMode === 'degrees' ? '31.79' : '400000'}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button 
              onClick={handleGoToCoords}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-100"
            >
              Aller à la position
            </button>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 right-28 z-[400] bg-transparent pointer-events-none items-center space-x-3">
        <p className="text-[10px] font-black tracking-tight text-black">
          <span className="opacity-60">X:</span> {coords.lon.toFixed(2)}
          <span className="mx-2 opacity-30">|</span>
          <span className="opacity-60">Y:</span> {coords.lat.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default MapComponent;