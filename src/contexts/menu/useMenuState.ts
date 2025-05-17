
import { useState, useEffect } from 'react';
import { MenuContextState } from './types';
import { calculateTotalPrice } from './menuUtils';
import { getTravelFee } from '@/data/travelData';

export const useMenuState = () => {
  const [selectedMenu, setSelectedMenu] = useState<string | null>(() => {
    const saved = localStorage.getItem('selectedMenu');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [selectedStarters, setSelectedStarters] = useState<string[]>(() => {
    const saved = localStorage.getItem('selectedStarters');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedSides, setSelectedSides] = useState<string[]>(() => {
    const saved = localStorage.getItem('selectedSides');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedDesserts, setSelectedDesserts] = useState<string[]>(() => {
    const saved = localStorage.getItem('selectedDesserts');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedExtras, setSelectedExtras] = useState<string[]>(() => {
    const saved = localStorage.getItem('selectedExtras');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedSeason, setSelectedSeason] = useState<'summer' | 'winter' | null>(() => {
    const saved = localStorage.getItem('selectedSeason');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [numGuests, setNumGuests] = useState<number>(() => {
    const saved = localStorage.getItem('numGuests');
    return saved ? JSON.parse(saved) : 50;
  });
  
  const [totalPrice, setTotalPrice] = useState<number>(0);
  
  const [extraSaladType, setExtraSaladType] = useState<string>(() => {
    const saved = localStorage.getItem('extraSaladType');
    return saved ? JSON.parse(saved) : '';
  });
  
  const [includeCutlery, setIncludeCutlery] = useState<boolean>(() => {
    const saved = localStorage.getItem('includeCutlery');
    return saved ? JSON.parse(saved) : true;
  });

  const [eventType, setEventType] = useState<string | null>(() => {
    const saved = localStorage.getItem('eventType');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [discountApplied, setDiscountApplied] = useState<boolean>(false);
  
  const [postalCode, setPostalCode] = useState<string>(() => {
    const saved = localStorage.getItem('postalCode');
    return saved ? JSON.parse(saved) : '';
  });
  
  const [travelFee, setTravelFee] = useState<number | null>(null);

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem('selectedMenu', JSON.stringify(selectedMenu));
  }, [selectedMenu]);
  
  useEffect(() => {
    localStorage.setItem('selectedStarters', JSON.stringify(selectedStarters));
  }, [selectedStarters]);
  
  useEffect(() => {
    localStorage.setItem('selectedSides', JSON.stringify(selectedSides));
  }, [selectedSides]);
  
  useEffect(() => {
    localStorage.setItem('selectedDesserts', JSON.stringify(selectedDesserts));
  }, [selectedDesserts]);
  
  useEffect(() => {
    localStorage.setItem('selectedExtras', JSON.stringify(selectedExtras));
  }, [selectedExtras]);
  
  useEffect(() => {
    localStorage.setItem('selectedSeason', JSON.stringify(selectedSeason));
  }, [selectedSeason]);
  
  useEffect(() => {
    localStorage.setItem('numGuests', JSON.stringify(numGuests));
  }, [numGuests]);
  
  useEffect(() => {
    localStorage.setItem('extraSaladType', JSON.stringify(extraSaladType));
  }, [extraSaladType]);
  
  useEffect(() => {
    localStorage.setItem('includeCutlery', JSON.stringify(includeCutlery));
  }, [includeCutlery]);

  useEffect(() => {
    localStorage.setItem('eventType', JSON.stringify(eventType));
  }, [eventType]);
  
  useEffect(() => {
    localStorage.setItem('postalCode', JSON.stringify(postalCode));
    // Update travel fee when postal code changes
    setTravelFee(getTravelFee(postalCode));
  }, [postalCode]);

  // Calculate prices and update state
  useEffect(() => {
    const state: MenuContextState = {
      selectedMenu,
      selectedStarters,
      selectedSides,
      selectedDesserts,
      selectedExtras,
      selectedSeason,
      numGuests,
      totalPrice,
      extraSaladType,
      discountApplied,
      includeCutlery,
      postalCode,
      travelFee,
      eventType
    };
    
    const calculatedPrice = calculateTotalPrice(state);
    setTotalPrice(calculatedPrice);
    setDiscountApplied(numGuests >= 100);
  }, [selectedMenu, selectedStarters, selectedSides, selectedDesserts, selectedExtras, numGuests, includeCutlery, postalCode]);

  return {
    selectedMenu,
    selectedStarters,
    selectedSides,
    selectedDesserts,
    selectedExtras,
    selectedSeason,
    numGuests,
    totalPrice,
    extraSaladType,
    discountApplied,
    includeCutlery,
    postalCode,
    travelFee,
    eventType,
    setSelectedMenu,
    setSelectedStarters,
    setSelectedSides,
    setSelectedDesserts,
    setSelectedExtras,
    setSelectedSeason,
    setNumGuests,
    setExtraSaladType,
    setIncludeCutlery,
    setPostalCode,
    setEventType
  };
};
