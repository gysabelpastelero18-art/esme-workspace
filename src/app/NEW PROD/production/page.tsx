// This file was corrupted by misplaced JSX. Restore to start with imports and component definition.
'use client';

import { useState, useEffect } from 'react';
import './production-custom.css';
import { saveProductionData as dbSaveProductionData, loadProductionData as dbLoadProductionData, deleteProductionData } from '@/lib/production-api';

interface ProductionItem {
  id: number;
  item: string;
  beg: number;
  production: number;
  del: number;
  used: number;
  cashier: number;
  bar: number;
  kitchen: number;
  oneBalete: number;
  foodtrays: number;
  event: number;
  spoilage: number;
  return: number;
  short: number;
  over: number;
  ending: number;
  sold: number;
}

export default function Production() {

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [selectedBranch, setSelectedBranch] = useState('Mayon Branch');
  const [selectedDepartment, setSelectedDepartment] = useState('Bakery');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [hasRecord, setHasRecord] = useState(false);
  const [isRecordLoaded, setIsRecordLoaded] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [transferEncodedBy, setTransferEncodedBy] = useState('');
  const [prodEncodedBy, setProdEncodedBy] = useState('');
  const [username, setUsername] = useState('Admin');
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  // Format date to MMMM/dd/yyyy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = months[date.getMonth()];
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Prevent hydration mismatch and get user data from database
  useEffect(() => {
    setIsHydrated(true);
    
    // Get user session from database instead of localStorage
    const fetchUserSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.user) {
            setUsername(result.user.username);
            setIsLoggedIn(true);
          } else {
            setUsername('Admin');
            setIsLoggedIn(false);
          }
        } else {
          setUsername('Admin');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
        setUsername('Admin');
        setIsLoggedIn(false);
      }
    };

    fetchUserSession();
  }, []);

  // Department-specific production data
  const getDepartmentData = () => {
    switch (selectedDepartment) {
      case 'Commissary':
        return [
          { id: 1, item: 'ADOBO DILAW CHICKEN THIGH', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 2, item: 'ADOBO FLAKES(300G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 3, item: 'ADOBO PUTI PORK LIEMPO(200G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 4, item: 'BALBACUA OXTAIL 62GMS/ KENCHIE 62GMS', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 5, item: 'BATCHOY KASIM (150G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 6, item: 'BATCHOY PORK MASK', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 7, item: 'BLUE MARLIN (270G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 8, item: 'FRAGRANCE BUTTER (450G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 9, item: 'BRICK CHICKEN', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 10, item: 'SHANK MEAT BULALO/CALDERETA', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 11, item: 'BURNT SAUCE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 12, item: 'GRILLED PORK', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 13, item: 'MAHI MAHI PREP', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 14, item: 'CALDERETA SAUCE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 15, item: 'SQUID CALAMARES PREP', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 16, item: 'CLUB CHICKEN PREP', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 17, item: 'GALANTINA', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 18, item: 'INASAL PREP', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 19, item: 'HAM (1KL)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 20, item: 'BANGUS MARINADE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 21, item: 'CRISPY PATA PREP', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 22, item: 'TADYANG', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 23, item: 'BISTEK SAUCE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 24, item: 'DINAMITA POPS MARINATION (2KG)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 25, item: 'DINUGUAN', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 26, item: 'FRIED CHICKEN', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 27, item: 'INIHAW PORK', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 28, item: 'BAGOONG', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 29, item: 'KARE KARE KENCHIE PREP 92GMS', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 30, item: 'KARE KARE OXTAIL PREP 92GRMS', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 31, item: 'KARE KARE SAUCE 300GRMS', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 32, item: 'LAING (220G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 33, item: 'LASAGNA WHOLE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 34, item: 'LECHON BELLY MARINATE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 35, item: 'LECHON BELLY BAKED', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 36, item: 'LECHON SAUCE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 37, item: 'SAMPALOK (1KL)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 38, item: 'NACHOS MEAT', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 39, item: 'CHICHARON FLOWER PREP', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 40, item: 'PALABOK SAUCE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 41, item: 'PALABOK MEAT', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 42, item: 'PINAHIGANG MANOK', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 43, item: 'ROAST BEEF', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 44, item: 'SALTED EGG CHICKEN', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 45, item: 'SISIG', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 46, item: 'SQUID TINTA PREP', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 47, item: 'TINUMOK', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 48, item: 'GARLIC LONGGANISA 120G', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 49, item: 'SWEET LONGGA 120G', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 50, item: 'TORTA MEAT (100G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 51, item: 'BINAGOONGAN (110G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 52, item: 'BBQ SAUCE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 53, item: 'BONE MARROW', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 54, item: 'CHIMICHURI', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, sold:0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0 },
          { id: 55, item: 'SOFRITO', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, sold:0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0 }
        ];
      case 'Bar':
        return [
          // BEER
          { id: 1, item: 'SMB CERVEZA NEGRA', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 2, item: 'SMB LIGHT', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0,  foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 3, item: 'SMB PALE PILSEN', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0,  foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 4, item: 'SMB SUPER DRY', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },

          // SODA
          { id: 5, item: 'COKE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 6, item: 'COKE ZERO', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0,  foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 7, item: 'COKE ZERO VANILLA', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0,foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 8, item: 'MOUNTAIN DEW', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 9, item: 'RITE n LITE (CALAMANSI GINGER)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 10, item: 'ROYAL', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 11, item: 'SARSI', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 12, item: 'SPRITE',beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 13, item: 'SPRITE ZERO', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },

          // WATER
          { id: 14, item: 'ABSOLUTE DISTILLED 1L', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 15, item: 'ABSOLUTE DISTILLED 350ml',beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 16, item: 'SUMMIT SPARKLING WATER 1L', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 17, item: 'SUMMIT SPARKLING WATER 330ML', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 18, item: 'SUMMIT STILL WATER 1L', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },

          // OTHERS
          { id: 19, item: 'JAR CHOCO CHIPS',beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 20, item: 'JAR MANGO', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 21, item: 'JAR ROCKY ROAD', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 22, item: 'JAR TOFFEE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 23, item: 'JAR TSOKO PEANUT', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
        ];
      
      case 'Cashier':
  return [
          // BREADS
          { id: 1, item: 'BALIWAG BONETE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 2, item: 'BICHO BICHO', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 3, item: 'BISCOCHO', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 4, item: 'BRIOCHE LOAF', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 5, item: 'CHEESE STREUSEL',beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 6, item: 'CHESSE PIMIENTO LOAF', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 7, item: 'GARLIC BAGUETTE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 8, item: 'HERBED ROLL', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 9, item: 'PANDESAL BIG', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 10, item: 'RAISIN LOAF', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0,  foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 11, item: 'SOURDOUGH', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 12, item: 'SPANISH BREAD', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 13, item: 'ULTIMATE CHEESE ROLL', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 14, item: 'WHOLE WHEAT LOAF', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          // CAKES & TORTES
          { id: 15, item: 'CASHEW SANSRIVAL 6', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 16, item: 'CASHEW SANSRIVAL 8', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 17, item: 'CHEESE CAKE GUAVA slice', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 18, item: 'DAYAP TORE 4 mini', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 19, item: 'DAYAP TORE 8 big', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 20, item: 'ESPRESSO PRALINE MINI', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 21, item: 'MANGO CREAM PIE slice', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 22, item: 'MANGO TORTE 4 mini', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 23, item: 'MANGO TORTE 8 big', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 24, item: 'STRAWBERRY SHORTCAKE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 25, item: 'TSOKOLATE BATIROL 4 mini', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 26, item: 'TSOKOLATE BATIROL 8 big', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 27, item: 'UBE VELVET MINI', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 28, item: 'UBE VELVET BIG', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          // PASTRIES & OTHERS
          { id: 29, item: 'BANANA TOFFEE MUFFIN', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 30, item: 'CHEESE CUPCAKE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 31, item: 'EMPANADA', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          // JARS
          { id: 32, item: 'JAR CHOCO CHIPS', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 33, item: 'JAR MANGO', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 34, item: 'JAR ROCKY ROAD', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 35, item: 'JAR TOFFEE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 36, item: 'JAR TSOKO PEANUT', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 37, item: 'JAR RASPBERRY', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 38, item: 'PECAN WALLNUT TART', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 39, item: 'STRAWBERRY TRES LECHES', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          // MEAT PRODUCTS
          { id: 40, item: 'SWEET AND SPICY TAPA', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 41, item: 'ADOBO FLAKES', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 42, item: 'GARLIC LONGGA', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 43, item: 'EMBOTIDO', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 44, item: 'SWEET AND SPICY LONGGA', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 }
        ];
      
      case 'Main Kitchen':
        return [
          { id: 1, item: 'ADOBO DILAW CHICKEN THIGH', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 2, item: 'ADOBO FLAKES(300G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 3, item: 'ADOBO PUTI PORK LIEMPO(200G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 4, item: 'BALBACUA OXTAIL 62GMS/ KENCHIE 62GMS', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 5, item: 'BATCHOY KASIM (150G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 6, item: 'BATCHOY PORK MASK', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 7, item: 'BLUE MARLIN (270G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 8, item: 'FRAGRANCE BUTTER (450G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 9, item: 'BRICK CHICKEN', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 10, item: 'SHANK MEAT BULALO/CALDERETA', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 11, item: 'BURNT SAUCE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 12, item: 'GRILLED PORK', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 13, item: 'MAHI MAHI PREP', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 14, item: 'CALDERETA SAUCE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 15, item: 'SQUID CALAMARES PREP', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 16, item: 'CLUB CHICKEN PREP', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 17, item: 'GALANTINA', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 18, item: 'INASAL PREP', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 19, item: 'HAM (1KL)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 20, item: 'BANGUS MARINADE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 21, item: 'CRISPY PATA PREP', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 22, item: 'TADYANG', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 23, item: 'BISTEK SAUCE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 24, item: 'DINAMITA POPS MARINATION (2KG)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 25, item: 'DINUGUAN', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 26, item: 'FRIED CHICKEN', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 27, item: 'INIHAW PORK', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 28, item: 'BAGOONG', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 29, item: 'KARE KARE KENCHIE PREP 92GMS', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 30, item: 'KARE KARE OXTAIL  PREP 92GRMS', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 31, item: 'KARE KARE SAUCE 300GRMS', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 32, item: 'LAING (220G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 33, item: 'LASAGNA WHOLE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 34, item: 'LECHON BELLY MARINATE (# of slab)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 35, item: 'LECHON BELLY BAKED (# of slab)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 36, item: 'LECHON SAUCE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 37, item: 'SAMPALOK (1KL)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 38, item: 'NACHOS MEAT', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 39, item: 'CHICHARON FLOWER PREP', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 40, item: 'PALABOK SAUCE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 41, item: 'PALABOK MEAT', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 42, item: 'PINAHIGANG MANOK', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 43, item: 'ROAST BEEF', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 44, item: 'SALTED EGG CHICKEN', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 45, item: 'SISIG', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 46, item: 'SQUID TINTA PREP', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 47, item: 'TINUMOK', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 48, item: 'GARLIC LONGGANISA 120G', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 49, item: 'SWEET LONGGA 120G', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 50, item: 'TORTA MEAT (100G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 51, item: 'BINAGOONGAN (110G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 52, item: 'BBQ SAUCE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 53, item: 'BONE MARROW', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 54, item: 'CHIMICHURI', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 55, item: 'SOFRITO', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 }
        ];
      
      // ===== HIGHLIGHT START: BAKERY ITEMS SECTION =====
      case 'Bakery':
      default:
        return [
          // BREADS
          { id: 1, item: 'BALIWAG BONETE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 2, item: 'BICHO BICHO', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 3, item: 'BISCOCHO', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 4, item: 'BRIOCHE LOAF', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 5, item: 'CHEESE STREUSEL', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 6, item: 'CHESSE PIMIENTO LOAF', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 7, item: 'GARLIC BAGUETTE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 8, item: 'HERBED ROLL', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 9, item: 'PANDESAL BIG', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 10, item: 'RAISIN LOAF', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 11, item: 'SOURDOUGH', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 12, item: 'SPANISH BREAD', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 13, item: 'ULTIMATE CHEESE ROLL', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 14, item: 'WHOLE WHEAT LOAF', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },

          // CAKES
          { id: 15, item: 'CASHEW SANSRIVAL 6', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 16, item: 'CASHEW SANSRIVAL 8', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 17, item: 'CHEESE CAKE GUAVA slice', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 18, item: 'DAYAP TORE 4 mini', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 19, item: 'DAYAP TORE 8 big', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 20, item: 'ESPRESSO PRALINE MINI', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 21, item: 'MANGO CREAM PIE slice', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 22, item: 'MANGO TORTE 4 mini', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 23, item: 'MANGO TORTE 8 big', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 24, item: 'STRAWBERRY SHORTCAKE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 25, item: 'TSOKOLATE BATIROL 4 mini', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 26, item: 'TSOKOLATE BATIROL 8 big', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 27, item: 'UBE VELVET MINI', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 28, item: 'UBE VELVET BIG', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          // PASTRIES & OTHERS
          { id: 29, item: 'BANANA TOFFEE MUFFIN', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 30, item: 'CHEESE CUPCAKE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 31, item: 'EMPANADA', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          // JARS
          { id: 32, item: 'JAR CHOCO CHIPS', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 33, item: 'JAR MANGO', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 34, item: 'JAR ROCKY ROAD', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 35, item: 'JAR TOFFEE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 36, item: 'JAR TSOKO PEANUT', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 37, item: 'JAR RASPBERRY', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 38, item: 'PECAN WALLNUT TART', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
          { id: 39, item: 'STRAWBERRY TRES LECHES', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
        ];
      // ===== HIGHLIGHT END: BAKERY ITEMS SECTION =====
    }
  };

  // Kitchen Prep data for Main Kitchen department only
  const getKitchenPrepData = (): ProductionItem[] => {
    return [
  { id: 101, item: 'ARROZ PREP', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
  { id: 102, item: 'BONE MARROW (1PC)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
  { id: 103, item: 'CHORIZO (3PCS SLICE)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
  { id: 104, item: 'CLUB BREAD (3PCS)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
  { id: 105, item: 'DINAMITA POPS (8PCS)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
  { id: 106, item: 'FRITTERS (5PCS)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
  { id: 107, item: 'HIPON PANSIT (3PCS) 30/35', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
  { id: 108, item: 'HIPON PANSIT (3PCS) 20/25', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
  { id: 109, item: 'KALABASA FLOWER (4PCS)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
  { id: 110, item: 'KESONG PUTI (2.5PCS)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
  { id: 111, item: 'LASAGNA PREP', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
  { id: 112, item: 'LUMPIA MIX VEGGIES', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
  { id: 113, item: 'PASTA - BIHON (180G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
      { id: 114, item: 'PASTA - JAPCHAE (200G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
      { id: 115, item: 'PASTA - PALABOK (200G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
      { id: 116, item: 'PASTA - PENNE (180G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
      { id: 117, item: 'PASTA - SPAGHETTI (180G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
      { id: 118, item: 'PEPPER PASTE (30G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
      { id: 119, item: 'SIDE MISUA PREP', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
      { id: 120, item: 'SIDE SKEWERS LIVER & MASKARA (45G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
      { id: 121, item: 'SIGARILYAS (120G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
      { id: 122, item: 'TINAPA FLAKES (30G)', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 },
      { id: 123, item: 'TINTA SAUCE', beg: 0, production: 0, del:0,used: 0,cashier:0,bar:0, kitchen: 0, oneBalete: 0, foodtrays: 0, event: 0, spoilage: 0, return: 0,short:0,over:0, ending: 0, sold: 0 }
    ];
  };

  // State for editable production data - now uses department-specific data
  const [productionData, setProductionData] = useState<ProductionItem[]>(getDepartmentData());
  // State for kitchen prep data - only for Main Kitchen
  const [kitchenPrepData, setKitchenPrepData] = useState<ProductionItem[]>(getKitchenPrepData());
  const [focusedCell, setFocusedCell] = useState<{row: number, col: number} | null>(null);

  // Excel-like editable fields
  const editableFields: (keyof ProductionItem)[] = [
    'beg', 'production', 'del', 'used', 'cashier', 'bar', 'kitchen', 'oneBalete', 'foodtrays', 'event', 'spoilage', 'return', 'short', 'over'
  ];

  // Keyboard navigation for Excel-like behavior
  const handleCellKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowIdx: number, colIdx: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    // Prevent value change for ArrowUp/ArrowDown
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
    let nextRow = rowIdx;
    let nextCol = colIdx;
    if (e.key === 'ArrowLeft') nextCol = Math.max(0, colIdx - 1);
    if (e.key === 'ArrowRight') nextCol = Math.min(editableFields.length - 1, colIdx + 1);
    if (e.key === 'ArrowUp') nextRow = Math.max(0, rowIdx - 1);
    if (e.key === 'ArrowDown') nextRow = Math.min(productionData.length - 1, rowIdx + 1);
    // Only move focus, do not change value
    setFocusedCell({ row: nextRow, col: nextCol });
    setTimeout(() => {
      const nextInput = document.querySelector(
        `input[data-row='${nextRow}'][data-col='${nextCol}']`
      ) as HTMLInputElement | null;
      if (nextInput) nextInput.focus();
    }, 0);
  };

  // Handler for editable table cells
  const handleCellChange = (rowIndex: number, field: keyof ProductionItem, value: string | number) => {
    const updatedData = productionData.map((row, idx) => {
      if (idx === rowIndex) {
        const updatedRow = { ...row, [field]: Number(value) };
        return { ...updatedRow, ending: calculateEnding(updatedRow) };
      }
      return row;
    });
    setProductionData(updatedData);
  };

  // Save production data to database
  const saveProductionData = async () => {
    setIsSaving(true);
    try {
      // Always recalculate ending for all rows before saving
      const recalcAllEndings = (dataArr: ProductionItem[]) =>
        dataArr.map(item => ({
          ...item,
          ending: calculateEnding(item)
        }));

      let dataToSave = selectedDepartment === 'Main Kitchen'
        ? [...recalcAllEndings(productionData), ...recalcAllEndings(kitchenPrepData)]
        : recalcAllEndings(productionData);

      // Ensure every item has 'sold' property (default 0)
      dataToSave = dataToSave.map(item => ({
        ...item,
        sold: typeof item.sold === 'number' ? item.sold : 0
      }));

      // If saving for Cashier, also update Bakery's cashier and production columns from Cashier's del column
      if (selectedDepartment === 'Cashier') {
        // Load Bakery data
        const bakeryData = await dbLoadProductionData(selectedDate, selectedBranch, 'Bakery');
        let updatedBakery;
        if (bakeryData.success && Array.isArray(bakeryData.data?.data) && bakeryData.data.data.length > 0) {
          // Update Bakery's cashier and production columns from Cashier's del column (match by id)
          updatedBakery = bakeryData.data.data.map((bakeryRow: any) => {
            const cashierRow = productionData.find(row => row.id === bakeryRow.id);
            return {
              ...bakeryRow,
              cashier: cashierRow ? Number(cashierRow.del) : bakeryRow.cashier,
              production: cashierRow ? Number(cashierRow.del) : bakeryRow.production
            };
          });
        } else {
          // No Bakery data exists for this date, create new from default Bakery items
          // getDepartmentData() returns the default items for the current department, so temporarily switch to Bakery
          const prevDepartment = selectedDepartment;
          setSelectedDepartment('Bakery');
          const defaultBakery = getDepartmentData();
          setSelectedDepartment(prevDepartment);
          updatedBakery = defaultBakery.map((bakeryRow: any) => {
            const cashierRow = productionData.find(row => row.id === bakeryRow.id);
            return {
              ...bakeryRow,
              cashier: cashierRow ? Number(cashierRow.del) : 0,
              production: cashierRow ? Number(cashierRow.del) : 0
            };
          });
        }
        // Save updated or new Bakery data
        await dbSaveProductionData(selectedDate, selectedBranch, 'Bakery', updatedBakery);
        setSaveMessage(prev => prev + '\nBakery cashier and production columns updated from Cashier.');
      }

      const result = await dbSaveProductionData(selectedDate, selectedBranch, selectedDepartment, dataToSave);
      if (result.success) {
        setHasRecord(true);
        setSaveMessage('✅ Production data saved successfully to database!');
      } else {
        setSaveMessage('❌ Error saving data: ' + result.message);
      }
    } catch (error) {
      setSaveMessage('❌ Error saving data: ' + (error as Error).message);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  // Load production data from database
  const loadProductionData = async () => {
    try {
      const result = await dbLoadProductionData(selectedDate, selectedBranch, selectedDepartment);
      
      if (result.success && result.data) {
        const loadedData = result.data.data;
        
        if (selectedDepartment === 'Main Kitchen') {
          // Separate the data into main production and kitchen prep
          const mainData = loadedData.filter((item: ProductionItem) => item.id <= 100);
          const kitchenPrepDataLoaded = loadedData.filter((item: ProductionItem) => item.id > 100);
          
          setProductionData(mainData.length > 0 ? mainData : getDepartmentData());
          setKitchenPrepData(kitchenPrepDataLoaded.length > 0 ? kitchenPrepDataLoaded : getKitchenPrepData());
        } else {
          setProductionData(loadedData);
        }
        
        setHasRecord(true);
        setIsRecordLoaded(true);
        return true;
      } else {
        setHasRecord(false);
        setIsRecordLoaded(true);
        return false;
      }
    } catch (error) {
      console.error('Error loading production data:', error);
      setHasRecord(false);
      setIsRecordLoaded(true);
      return false;
    }
  };

  // Check if record exists for current date/branch/department
  const checkRecordExists = async () => {
    try {
      const result = await dbLoadProductionData(selectedDate, selectedBranch, selectedDepartment);
      const exists = !!(result.success && result.data);
      setHasRecord(exists);
      return exists;
    } catch (error) {
      setHasRecord(false);
      return false;
    }
  };

  // Load default department data
  const loadDefaultData = async () => {
    // First try to load yesterday's ending values
    const yesterdayLoaded = await loadYesterdayEndingValues();
    
    // If no yesterday data, use default data
    if (!yesterdayLoaded) {
      setProductionData(getDepartmentData());
      if (selectedDepartment === 'Main Kitchen') {
        setKitchenPrepData(getKitchenPrepData());
      }
    }
    
    setHasRecord(false);
    setIsRecordLoaded(true);
  };

  // Get yesterday's date in YYYY-MM-DD format
  const getYesterdayDate = (currentDate: string) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  };

  // Load yesterday's ending values and update today's beginning values
  const loadYesterdayEndingValues = async () => {
    try {
      const yesterdayDate = getYesterdayDate(selectedDate);
      const result = await dbLoadProductionData(yesterdayDate, selectedBranch, selectedDepartment);
      if (result.success && result.data && result.data.data) {
        const yesterdayData = result.data.data;
        const currentData = getDepartmentData();
        // Debug: log all yesterday and today items
        console.log('DEBUG: Yesterday Data:', yesterdayData);
        console.log('DEBUG: Current Data:', currentData);
        // Match by id and normalized item name (trimmed, lowercased)
        const updatedData = currentData.map(currentItem => {
          const yesterdayItem = yesterdayData.find((yItem: ProductionItem) =>
            yItem.id === currentItem.id &&
            yItem.item.trim().toLowerCase() === currentItem.item.trim().toLowerCase()
          );
          if (yesterdayItem) {
            console.log(`DEBUG: Matched [${currentItem.item}] (id:${currentItem.id}) - Yesterday ending: ${yesterdayItem.ending} -> Today beg`);
            return {
              ...currentItem,
              beg: yesterdayItem.ending
            };
          } else {
            console.warn(`DEBUG: No match for [${currentItem.item}] (id:${currentItem.id})`);
          }
          return currentItem;
        });
        setProductionData(updatedData);
        if (selectedDepartment === 'Main Kitchen') {
          const currentKitchenPrepData = getKitchenPrepData();
          const updatedKitchenPrepData = currentKitchenPrepData.map(currentItem => {
            const yesterdayItem = yesterdayData.find((yItem: ProductionItem) =>
              yItem.id === currentItem.id &&
              yItem.item.trim().toLowerCase() === currentItem.item.trim().toLowerCase()
            );
            if (yesterdayItem) {
              console.log(`DEBUG: [KitchenPrep] Matched [${currentItem.item}] (id:${currentItem.id}) - Yesterday ending: ${yesterdayItem.ending} -> Today beg`);
              return {
                ...currentItem,
                beg: yesterdayItem.ending
              };
            } else {
              console.warn(`DEBUG: [KitchenPrep] No match for [${currentItem.item}] (id:${currentItem.id})`);
            }
            return currentItem;
          });
          setKitchenPrepData(updatedKitchenPrepData);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading yesterday\'s ending values:', error);
      return false;
    }
  };

  // Update production data when department, date, or branch changes
  useEffect(() => {
    if (!isHydrated) return; // Wait for hydration
    
    const loadData = async () => {
      setIsRecordLoaded(false);
      setSaveMessage('');
      
      // Try to load saved data first
      const loaded = await loadProductionData();
      
      // If no saved data, load default data
      if (!loaded) {
        await loadDefaultData();
      }
    };

    loadData();
  }, [selectedDepartment, selectedDate, selectedBranch, isHydrated]);

  // Update production data when department changes (keeping this for compatibility)
  useEffect(() => {
    if (!isRecordLoaded || !isHydrated) {
      setProductionData(getDepartmentData());
      setKitchenPrepData(getKitchenPrepData());
    }
  }, [selectedDepartment, isRecordLoaded, isHydrated]);

  // Handle input changes
  const handleInputChange = (id: number, field: keyof ProductionItem, value: string) => {
    if (field === 'ending') return; // Don't allow editing calculated fields
    
    const numValue = field === 'item' ? value : (parseInt(value) || 0);
    setProductionData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, [field]: numValue } : item
      )
    );
  };

  // Handle input changes for kitchen prep data
  const handleKitchenPrepInputChange = (id: number, field: keyof ProductionItem, value: string) => {
    if (field === 'ending') return; // Don't allow editing calculated fields
    
    const numValue = field === 'item' ? value : (parseInt(value) || 0);
    setKitchenPrepData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, [field]: numValue } : item
      )
    );
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
    const totalRows = productionData.length;
    const totalCols = 10; // Total number of editable columns (item column is no longer editable)

    let newRow = rowIndex;
    let newCol = colIndex;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        newRow = Math.max(0, rowIndex - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newRow = Math.min(totalRows - 1, rowIndex + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newCol = Math.max(0, colIndex - 1);
        break;
      case 'ArrowRight':
      case 'Tab':
        e.preventDefault();
        newCol = colIndex + 1;
        if (newCol >= totalCols) {
          newCol = 0;
          newRow = Math.min(totalRows - 1, rowIndex + 1);
        }
        break;
      case 'Enter':
        e.preventDefault();
        newRow = Math.min(totalRows - 1, rowIndex + 1);
        break;
    }

    // Focus the new cell
    if (newRow !== rowIndex || newCol !== colIndex) {
      setFocusedCell({ row: newRow, col: newCol });
      // Focus the input element
      setTimeout(() => {
        const cellId = `cell-${newRow}-${newCol}`;
        const input = document.getElementById(cellId) as HTMLInputElement;
        if (input) {
          input.focus();
          if (e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
            input.select();
          }
        }
      }, 10);
    }
  };

  // Handle keyboard navigation for kitchen prep table
  const handleKitchenPrepKeyDown = (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
    const totalRows = kitchenPrepData.length;
    const totalCols = 10; // Total number of editable columns (same as main table)

    let newRow = rowIndex;
    let newCol = colIndex;

    switch (e.key) {
      case 'ArrowUp':
        // Prevent value change
        e.preventDefault();
        newRow = Math.max(0, rowIndex - 1);
        break;
      case 'ArrowDown':
        // Prevent value change
        e.preventDefault();
        newRow = Math.min(totalRows - 1, rowIndex + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newCol = Math.max(0, colIndex - 1);
        break;
      case 'ArrowRight':
      case 'Tab':
        e.preventDefault();
        newCol = colIndex + 1;
        if (newCol >= totalCols) {
          newCol = 0;
          newRow = Math.min(totalRows - 1, rowIndex + 1);
        }
        break;
      case 'Enter':
        e.preventDefault();
        newRow = Math.min(totalRows - 1, rowIndex + 1);
        break;
    }

    // Focus the new cell
    if (newRow !== rowIndex || newCol !== colIndex) {
      setFocusedCell({ row: newRow, col: newCol });
      // Focus the input element
      setTimeout(() => {
        const cellId = `kitchen-prep-cell-${newRow}-${newCol}`;
        const input = document.getElementById(cellId) as HTMLInputElement;
        if (input) {
          input.focus();
          if (e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
            input.select();
          }
        }
      }, 10);
    }
  };

  // Auto-calculate ending inventory: (beg + prod + del + return + over) - (used + cashier + bar + kitchen + oneBalete + foodtrays + event + spoilage + short)
  const calculateEnding = (item: ProductionItem) => {
    const beg = Number(item.beg) || 0;
    const prod = Number(item.production) || 0;
    const del = Number((item as any)?.del ?? 0) || 0;
    const returnVal = Number(item.return) || 0;
    const over = Number(item.over) || 0;
    const used = Number(item.used) || 0;
    const cashier = Number((item as any)?.cashier ?? 0) || 0;
    const bar = Number((item as any)?.bar ?? 0) || 0;
    const kitchen = Number(item.kitchen) || 0;
    const oneBalete = Number((item as any)?.oneBalete ?? 0) || 0;
    const foodtrays = Number((item as any)?.foodtrays ?? 0) || 0;
    const event = Number((item as any)?.event ?? 0) || 0;
    const spoilage = Number((item as any)?.spoilage ?? 0) || 0;
    const short = Number(item.short) || 0;
    return (
      beg + prod + del + returnVal + over
    ) - (
      used + cashier + bar + kitchen + oneBalete + foodtrays + event + spoilage + short
    );
  };

  // Auto-calculate used total: Kitchen + 1B + Foodtrays + Event (for reference, but Used is now editable)
  const calculateUsedTotal = (item: ProductionItem) => {
    return item.kitchen + item.oneBalete + item.foodtrays + item.event;
  };

  // Update ending calculation when inputs change
  const updateEndingCalculation = (id: number) => {
    setProductionData(prevData =>
      prevData.map(item => {
        if (item.id === id) {
          const newEnding = (item.beg + item.production) - item.used - item.kitchen - item.oneBalete - item.foodtrays - item.event;
          return { ...item, ending: newEnding };
        }
        return item;
      })
    );
  };

  // Update ending calculation for kitchen prep when inputs change
  const updateKitchenPrepEndingCalculation = (id: number) => {
    setKitchenPrepData(prevData =>
      prevData.map(item => {
        if (item.id === id) {
          const newEnding = (item.beg + item.production) - item.used - item.kitchen - item.oneBalete - item.foodtrays - item.event;
          return { ...item, ending: newEnding };
        }
        return item;
      })
    );
  };

  // Save functionality - now uses database
  const handleSave = async () => {
    await saveProductionData();
  };

  // Reset to default data
  const handleReset = async () => {
    if (confirm('Are you sure you want to reset to default data? This will permanently delete the saved record.')) {
      try {
        const result = await deleteProductionData(selectedDate, selectedBranch, selectedDepartment);
        await loadDefaultData();
        
        if (result.success) {
          setSaveMessage('🔄 Data reset to default template and record deleted');
        } else {
          setSaveMessage('🔄 Data reset to default template');
        }
      } catch (error) {
        setSaveMessage('🔄 Data reset to default template');
      }
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  // Update beginning values from yesterday's ending values
  const handleUpdateFromYesterday = async () => {
    if (confirm('Update beginning values from yesterday\'s ending values? This will only affect beginning quantities.')) {
      try {
        const updated = await loadYesterdayEndingValues();
        if (updated) {
          setSaveMessage('📈 Beginning values updated from yesterday\'s ending values');
        } else {
          setSaveMessage('❌ No data found for yesterday');
        }
        setTimeout(() => setSaveMessage(''), 3000);
      } catch (error) {
        setSaveMessage('❌ Error updating from yesterday\'s data');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    }
  };

  // Add new item functionality
  const addNewItem = () => {
    const newId = Math.max(...productionData.map(item => item.id)) + 1;
    const newItem: ProductionItem = {
      id: newId,
      item: '🆕 New Item',
      beg: 0,
      production: 0,
      del: 0,
      used: 0,
      cashier: 0,
      bar: 0,
      kitchen: 0,
      oneBalete: 0,
      foodtrays: 0,
      event: 0,
      spoilage: 0,
      return: 0,
      short: 0,
      over: 0,
      ending: 0,
      sold: 0
    };
    setProductionData([...productionData, newItem]);
  };

  return (
    !isHydrated ? null : (
      <>
      {/* Combined CSS styles */}
      <style jsx>{`
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type=number] {
          -moz-appearance: textfield;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @media print {
          /* Make ending column numbers match header color */
          td.number-col.ending-col, td.ending-col, td .ending-print-value, td input.ending-print-input, td div.ending-print-div {
            color: #006400 !important;
          }
          /* Make numbers in beg to ending columns larger for print */
          td.number-col, th.number-col, td .print-value, td input[type='number'], td div {
            font-size: 12px !important;
            font-family: Arial, Helvetica, sans-serif !important;
            font-weight: 700 !important;
            color: #111 !important;
            letter-spacing: 0.5px !important;
          }
          @page {
            size: letter;
            margin: 0.3in;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            font-family: Arial, sans-serif !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          main {
            margin: 0 !important;
            padding: 0 !important;
            max-width: none !important;
          }
          
          div {
            background: white !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            backdrop-filter: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Specific styling for print table container */
          div:has(table) {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
          
          table {
            width: 100% !important;
            font-size: 10px !important;
            border-collapse: collapse !important;
            border: 1px solid #d3d3d3 !important;
          }
          
          th, td {
            padding: 2px 4px !important;
            border: 1px solid #d3d3d3 !important;
            font-size: 10px !important;
            line-height: 1.1 !important;
          }
          
          th {
            background: #f0f0f0 !important;
            font-weight: bold !important;
            border: 1px solid #d3d3d3 !important;
          }
          
          input {
            border: none !important;
            background: transparent !important;
            font-size: 10px !important;
            color: #000 !important;
            text-align: center !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          input[type="text"] {
            text-align: left !important;
          }
          
          /* Hide signature fields if they contain placeholder or are empty */
          input[placeholder="Enter name..."]:placeholder-shown {
            display: none !important;
          }
          
          input:not([value]):not(:focus) {
            display: none !important;
          }
          
          input[value=""]:not(:focus) {
            display: none !important;
          }
          
          /* Hide signature section labels if corresponding input is empty */
          div:has(input[placeholder="Enter name..."]:placeholder-shown) label {
            display: none !important;
          }
          
          .summary-cards {
            display: none !important;
          }
        }
      `}</style>
      
  {/* ...existing code... */}
      
      {/* Header */}
      <header 
        className="no-print"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(156,175,136,0.2)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div 
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div 
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(74,103,65,0.4)',
                overflow: 'hidden',
                background: 'white'
              }}
            >
              <img 
                src="/images/logo.png" 
                alt="ESMERALDA Finance Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div>
              <h1 
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#006400',
                  margin: '0 0 4px 0',
                  fontFamily: 'Georgia, serif'
                }}
              >
                ESMERALDA Finance
              </h1>
              <p 
                className="no-print"
                style={{
                  color: '#4A6741',
                  margin: 0,
                  fontSize: '11px'
                }}
              >
                Production Management
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => {
                // Ensure we navigate to the main dashboard page
                window.location.href = '/';
                // Alternative navigation method as backup
                if (typeof window !== 'undefined') {
                  window.location.replace('/');
                }
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '8px 16px',
                borderRadius: '50px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#006400',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🏠 Dashboard
            </button>
            {isLoggedIn && username && (
              <div 
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '8px 16px',
                  borderRadius: '50px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#006400',
                  fontWeight: '600'
                }}
              >
                👋 Welcome, {username}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main 
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '32px 20px',
          position: 'relative',
          zIndex: 5
        }}
      >
        {/* Page Header */}
        <div 
          style={{
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(156,175,136,0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            padding: '32px',
            marginBottom: '32px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              right: '-2px',
              bottom: '-2px',
              background: 'linear-gradient(135deg, rgba(156,175,136,0.1), rgba(74,103,65,0.08), rgba(255,152,0,0.06))',
              borderRadius: '20px',
              zIndex: -1
            }}
          />
          
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '16px',
              padding: '24px'
            }}
          >
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '16px',
                position: 'relative'
              }}
            >
              <h2 
                className="no-print"
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#006400',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontFamily: 'Georgia, serif'
                }}
              >
                🍳 Production Management
                <span 
                  style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#4A6741',
                    background: 'rgba(156,175,136,0.2)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: '1px solid rgba(156,175,136,0.3)'
                  }}
                >
                  {selectedDepartment === 'Bakery' && '🥖'}
                  {selectedDepartment === 'Bar' && '🍹'}
                  {selectedDepartment === 'Cashier' && '💰'}
                  {selectedDepartment === 'Commissary' && '🥘'}
                  {selectedDepartment === 'Main Kitchen' && '🍳'}
                  {' '}{selectedDepartment}
                </span>
              </h2>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }} className="no-print">
                {/* Save Button */}
                {/* Print DR Button aligned right */}
                <button
                  onClick={() => window.location.href = '/delivery-form'}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    background: 'linear-gradient(135deg, #FFB300, #FFA726)',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(255,179,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 2
                  }}
                  onMouseEnter={e => {
                    const target = e.target as HTMLButtonElement;
                    target.style.transform = 'translateY(-2px)';
                    target.style.boxShadow = '0 6px 16px rgba(255,179,0,0.4)';
                  }}
                  onMouseLeave={e => {
                    const target = e.target as HTMLButtonElement;
                    target.style.transform = 'translateY(0)';
                    target.style.boxShadow = '0 4px 12px rgba(255,179,0,0.3)';
                  }}
                >
                  🚚 Print DR
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{
                    background: isSaving ? '#ccc' : 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(76,175,80,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSaving) {
                      const target = e.target as HTMLButtonElement;
                      target.style.transform = 'translateY(-2px)';
                      target.style.boxShadow = '0 6px 16px rgba(76,175,80,0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSaving) {
                      const target = e.target as HTMLButtonElement;
                      target.style.transform = 'translateY(0)';
                      target.style.boxShadow = '0 4px 12px rgba(76,175,80,0.3)';
                    }
                  }}
                >
                  {isSaving ? (
                    <>
                      <td style={{ 
                        color: '#006400', 
                        fontWeight: '900',
                        fontFamily: 'Arial, sans-serif',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        border: '1px solid #006400',
                        backgroundColor: 'rgba(0,100,0,0.05)',
                        fontSize: '15px'
                      }}>{selectedDepartment === 'Main Kitchen' ? 'COMMI ITEMS TOTAL' : 'TOTALS'}</td>
                    </>
                  ) : (
                    <>💾 Save Data</>
                  )}
                </button>

                {/* Add New Item Button */}
                <button
                  onClick={addNewItem}
                  style={{
                    background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(33,150,243,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.transform = 'translateY(-2px)';
                    target.style.boxShadow = '0 6px 16px rgba(33,150,243,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.transform = 'translateY(0)';
                    target.style.boxShadow = '0 4px 12px rgba(33,150,243,0.3)';
                  }}
                >
                  ➕ Add Item
                </button>

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  style={{
                    background: 'linear-gradient(135deg, #FF5722, #D32F2F)',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(255,87,34,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.transform = 'translateY(-2px)';
                    target.style.boxShadow = '0 6px 16px rgba(255,87,34,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.transform = 'translateY(0)';
                    target.style.boxShadow = '0 4px 12px rgba(255,87,34,0.3)';
                  }}
                >
                  🔄 Reset
                </button>

                {/* Update from Yesterday Button */}
                <button
                  onClick={handleUpdateFromYesterday}
                  style={{
                    background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(156,39,176,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.transform = 'translateY(-2px)';
                    target.style.boxShadow = '0 6px 16px rgba(156,39,176,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.transform = 'translateY(0)';
                    target.style.boxShadow = '0 4px 12px rgba(156,39,176,0.3)';
                  }}
                >
                  📈 Update from Yesterday
                </button>

                {/* Print Button */}
                <button
                  onClick={() => {
                    if (selectedDepartment === 'Bakery') {
                      const params = new URLSearchParams({ date: selectedDate, branch: selectedBranch });
                      window.open(`/bakery-inv?${params.toString()}`, '_blank');
                    } else if (selectedDepartment === 'Cashier') {
                      const params = new URLSearchParams({ date: selectedDate, branch: selectedBranch });
                      window.open(`/cashier-inv?${params.toString()}`, '_blank');
                    } else if (selectedDepartment === 'Commissary') {
                      const params = new URLSearchParams({ date: selectedDate, branch: selectedBranch });
                      window.open(`/commi-inv?${params.toString()}`, '_blank');
                    } else {
                      window.print();
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #607D8B, #455A64)',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(96,125,139,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.transform = 'translateY(-2px)';
                    target.style.boxShadow = '0 6px 16px rgba(96,125,139,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.transform = 'translateY(0)';
                    target.style.boxShadow = '0 4px 12px rgba(96,125,139,0.3)';
                  }}
                >
                  🖨️ Print Report
                </button>
              </div>
            </div>
            
            {/* Date, Branch, and Department Selectors Row */}
            <div 
              className="no-print selector-18"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}
            >
              {/* Date Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#4A6741', fontWeight: '500' }}>📅 Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="selector-18"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid #9CAF88',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#4A6741',
                    outline: 'none'
                  }}
                />
              </div>
              
              {/* Branch Selector */}
              <select 
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="selector-18"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid #9CAF88',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#4A6741',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option>Mayon Branch</option>
                <option>One Balete Branch</option>
              </select>
              
              {/* Department Selector */}
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  background: 'linear-gradient(135deg, rgba(156,175,136,0.15), rgba(74,103,65,0.1))',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(156,175,136,0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <span style={{ color: '#4A6741', fontWeight: '600' }}>🏪 Department:</span>
                <select 
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="selector-18"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #9CAF88',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#4A6741',
                    outline: 'none',
                    cursor: 'pointer',
                    minWidth: '140px',
                    fontWeight: '700',
                    boxShadow: '0 2px 8px rgba(74,103,65,0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    const target = e.target as HTMLSelectElement;
                    target.style.boxShadow = '0 4px 12px rgba(74,103,65,0.2)';
                    target.style.borderColor = '#4A6741';
                  }}
                  onBlur={(e) => {
                    const target = e.target as HTMLSelectElement;
                    target.style.boxShadow = '0 2px 8px rgba(74,103,65,0.1)';
                    target.style.borderColor = '#9CAF88';
                  }}
                >
                  <option value="Bakery">🥖 Bakery</option>
                  <option value="Bar">🍹 Bar</option>
                  <option value="Cashier">💰 Cashier</option>
                  <option value="Commissary">🥘 Commissary</option>
                  <option value="Main Kitchen">🍳 Main Kitchen</option>
                </select>
              </div>
            </div>

            {/* Save Message */}
            {saveMessage && (
              <div 
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: saveMessage.includes('✅') 
                    ? 'rgba(76,175,80,0.1)' 
                    : 'rgba(244,67,54,0.1)',
                  border: saveMessage.includes('✅') 
                    ? '1px solid rgba(76,175,80,0.3)' 
                    : '1px solid rgba(244,67,54,0.3)',
                  color: saveMessage.includes('✅') ? '#2E7D32' : '#D32F2F',
                  fontWeight: '700',
                  marginBottom: '16px',
                  animation: 'fadeInOut 0.3s ease-in'
                }}
              >
                {saveMessage}
              </div>
            )}
            
            <p 
              className="no-print instruction-18"
              style={{
                color: '#4A6741',
                margin: 0,
                lineHeight: '1.5'
              }}
            >
              Track daily production quantities for <strong style={{ color: '#006400' }}>{selectedDepartment}</strong> department, usage across different outlets, and inventory management. 
              <strong style={{ color: '#006400' }}> Click any cell to edit values. </strong>
            </p>
          </div>
        </div>

        {/* Production Table */}
        <div 
          style={{
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(156,175,136,0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            padding: '32px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              right: '-2px',
              bottom: '-2px',
              background: 'linear-gradient(135deg, rgba(156,175,136,0.1), rgba(74,103,65,0.08))',
              borderRadius: '20px',
              zIndex: -1
            }}
          />
          
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '16px',
              padding: '24px'
            }}
          >
            {/* Print Header - Daily Inventory */}
            <div 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                padding: '16px 0',
                borderBottom: '3px solid #006400',
                pageBreakInside: 'avoid'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img 
                  src="/images/logo.png" 
                  alt="Logo"
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'contain'
                  }}
                />
                <div style={{ 
                  fontSize: '11px', 
                  fontWeight: '700', 
                  color: '#006400',
                  fontFamily: 'Arial, sans-serif',
                  letterSpacing: '0.5px'
                }}>
                  Date: {formatDate(selectedDate)}
                </div>
              </div>
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1
              }}>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: '800', 
                  color: '#006400',
                  fontFamily: 'Arial, sans-serif',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '4px'
                }}>
                  DAILY INVENTORY
                </div>
                <div 
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#4A6741',
                    fontFamily: 'Arial, sans-serif',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}
                >
                  Department: {selectedDepartment}
                </div>
              </div>
              <div style={{ 
                fontSize: '11px', 
                fontWeight: '700', 
                color: '#006400',
                fontFamily: 'Arial, sans-serif',
                letterSpacing: '0.5px'
              }}>
                {selectedBranch}
              </div>
            </div>

            {/* Record Status Display */}
            {isRecordLoaded && (
              <div 
                className="no-print"
                style={{
                  marginBottom: '20px',
                  padding: '16px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  fontSize: '11px',
                  fontWeight: '600',
                  background: hasRecord 
                    ? 'rgba(76, 175, 80, 0.1)' 
                    : 'rgba(255, 152, 0, 0.1)',
                  border: hasRecord
                    ? '1px solid rgba(76, 175, 80, 0.3)'
                    : '1px solid rgba(255, 152, 0, 0.3)',
                  color: hasRecord ? '#2E7D32' : '#F57C00'
                }}
              >
                {hasRecord ? (
                  <>
                    📊 <strong>Record Found:</strong> {selectedDate} - {selectedBranch} - {selectedDepartment}
                    <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.8 }}>
                      You can edit the data and save changes
                    </div>
                  </>
                ) : (
                  <>
                    📝 <strong>No Record Found:</strong> {selectedDate} - {selectedBranch} - {selectedDepartment}
                    <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.8 }}>
                      Default template loaded. Enter your data and click Save.
                    </div>
                  </>
                )}
              </div>
            )}

            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                border: '1px solid #d3d3d3'
              }}>
                <thead>
                  <tr style={{ 
                    borderBottom: '3px solid rgba(0,100,0,0.8)',
                    background: 'linear-gradient(135deg, rgba(156,175,136,0.15), rgba(74,103,65,0.1))'
                  }}>
                    {/* LEFT ALIGN: Item column header */}
                    <th style={{ 
                      textAlign: 'left', 
                      padding: '16px 12px', 
                      color: '#006400', 
                      fontWeight: '800', 
                      fontSize: '15px', 
                      minWidth: '200px', 
                      maxWidth: '250px', 
                      width: 'auto',
                      border: '1px solid #d3d3d3',
                      fontFamily: 'Arial, sans-serif',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                     }}>
                          Item
                        </th>
                        <th style={{ 
                          textAlign: 'left', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Beg
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Prod
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Del
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Used
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Cashier
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Bar
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Kitchen
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          1B
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Sold
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Event
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Spoil
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Return
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Short
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Over
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Ending
                        </th>
                  </tr>
                </thead>
                <tbody>
                  {productionData.map((row, rowIdx) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                      {/* LEFT ALIGN: Item column cell */}
                      <td style={{ borderRight: '1px solid #e0e0e0', textAlign: 'left' }}>{row.item}</td>
                      {editableFields.map((field, colIdx) => {
                        // Columns from production to over should show empty if value is zero
                        const showEmpty = [
                          'production', 'del', 'used', 'cashier', 'bar', 'kitchen', 'oneBalete',
                          'foodtrays', 'event', 'spoilage', 'return', 'short', 'over'
                        ].includes(field);
                        const value = showEmpty && row[field] === 0 ? '' : row[field];
                        return (
                          <td key={field as string} style={{ textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                            {/* NUMBER INPUT STYLE: adjust fontSize/fontFamily here for consistency */}
                            <input
                              type="number"
                              value={value}
                              style={{ width: 60, textAlign: 'center', border: 'none', outline: 'none', background: 'transparent' , fontSize: '18px', fontFamily: 'Arial, sans-serif' }}
                              tabIndex={0}
                              data-row={rowIdx}
                              data-col={colIdx}
                              onFocus={e => {
                                setFocusedCell({ row: rowIdx, col: colIdx });
                                // Select the value when focused
                                setTimeout(() => {
                                  if (e.target && typeof e.target.select === 'function') e.target.select();
                                }, 0);
                              }}
                              onMouseDown={e => {
                                // Prevent default to ensure select on focus works
                                e.preventDefault();
                                (e.target as HTMLInputElement).focus();
                              }}
                              onKeyDown={e => {
                                if ((selectedDepartment === 'Commissary') && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
                                  e.preventDefault();
                                }
                                handleCellKeyDown(e, rowIdx, colIdx);
                              }}
                              onWheel={e => {
                                if (selectedDepartment === 'Commissary') {
                                  e.preventDefault();
                                  (e.target as HTMLInputElement).blur();
                                }
                              }}
                              onChange={e => handleCellChange(rowIdx, field, e.target.value)}
                              autoFocus={!!(focusedCell && focusedCell.row === rowIdx && focusedCell.col === colIdx)}
                            />
                          </td>
                        );
                      })}
                      <td style={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', background: 'rgba(46,125,50,0.2)', /* <-- This makes the background curved */ fontWeight: 'bold' }}>{row.ending}</td>
                    </tr>
                  ))}
                </tbody>
                {/* === TABLE TOTAL FOOTER START === */}
                <tfoot>
                  <tr style={{ 
                    background: 'rgba(0,100,0,0.05)', 
                    fontWeight: 'bold',
                    fontSize: '11px',
                    borderTop: '3px solid #006400',
                    borderBottom: '2px solid #006400'
                  }}>
                    <td style={{ 
                      padding: '16px 12px', 
                      color: '#006400', 
                      fontWeight: '900',
                      fontFamily: 'Arial, sans-serif',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      border: '1px solid #006400',
                      backgroundColor: 'rgba(0,100,0,0.05)',
                      fontSize: '15px'
                    }}>{selectedDepartment === 'Main Kitchen' ? 'COMMI ITEMS TOTAL' : 'TOTALS'}</td>
                    <td style={{ textAlign: 'center', padding: '12px 4px', fontSize: '15px', borderRight: '1px solid #e0e0e0' }}>{productionData.reduce((sum, item) => sum + Number(item.beg || 0), 0)}</td>
                    <td style={{ textAlign: 'center', padding: '12px 4px', fontSize: '15px', borderRight: '1px solid #e0e0e0' }}>{productionData.reduce((sum, item) => sum + Number(item.production || 0), 0)}</td>
                    <td style={{ textAlign: 'center', padding: '12px 4px', fontSize: '15px', borderRight: '1px solid #e0e0e0' }}>{productionData.reduce((sum, item) => sum + Number(item.del || 0), 0)}</td>
                    <td style={{ textAlign: 'center', padding: '12px 4px', fontSize: '15px', borderRight: '1px solid #e0e0e0' }}>{productionData.reduce((sum, item) => sum + Number(item.used || 0), 0)}</td>
                    <td style={{ textAlign: 'center', padding: '12px 4px', fontSize: '15px', borderRight: '1px solid #e0e0e0' }}>{productionData.reduce((sum, item) => sum + Number(item.cashier || 0), 0)}</td>
                    <td style={{ textAlign: 'center', padding: '12px 4px', fontSize: '15px', borderRight: '1px solid #e0e0e0' }}>{productionData.reduce((sum, item) => sum + Number(item.bar || 0), 0)}</td>
                    <td style={{ textAlign: 'center', padding: '12px 4px', fontSize: '15px', borderRight: '1px solid #e0e0e0' }}>{productionData.reduce((sum, item) => sum + Number(item.kitchen || 0), 0)}</td>
                    <td style={{ textAlign: 'center', padding: '12px 4px', fontSize: '15px', borderRight: '1px solid #e0e0e0' }}>{productionData.reduce((sum, item) => sum + Number(item.oneBalete || 0), 0)}</td>
                    <td style={{ textAlign: 'center', padding: '12px 4px', fontSize: '15px', borderRight: '1px solid #e0e0e0' }}>{productionData.reduce((sum, item) => sum + Number(item.foodtrays || 0), 0)}</td>
                    <td style={{ textAlign: 'center', padding: '12px 4px', fontSize: '15px', borderRight: '1px solid #e0e0e0' }}>{productionData.reduce((sum, item) => sum + Number(item.event || 0), 0)}</td>
                    <td style={{ textAlign: 'center', padding: '12px 4px', fontSize: '15px', borderRight: '1px solid #e0e0e0' }}>{productionData.reduce((sum, item) => sum + Number(item.spoilage || 0), 0)}</td>
                    <td style={{ textAlign: 'center', padding: '12px 4px', fontSize: '15px', borderRight: '1px solid #e0e0e0' }}>{productionData.reduce((sum, item) => sum + Number(item.return || 0), 0)}</td>
                    <td style={{ textAlign: 'center', padding: '12px 4px', fontSize: '15px', borderRight: '1px solid #e0e0e0' }}>{productionData.reduce((sum, item) => sum + Number(item.short || 0), 0)}</td>
                    <td style={{ textAlign: 'center', padding: '12px 4px', fontSize: '15px', borderRight: '1px solid #e0e0e0' }}>{productionData.reduce((sum, item) => sum + Number(item.over || 0), 0)}</td>
                    <td style={{ textAlign: 'center', padding: '12px 4px', fontSize: '15px', fontWeight: 'bold', background: 'rgba(46,125,50,0.2)', /* <-- This makes the background curved */ borderRight: '1px solid #e0e0e0' }}>{productionData.reduce((sum, item) => sum + calculateEnding(item), 0)}</td>
                  </tr>
                </tfoot>
                {/* === TABLE TOTAL FOOTER END === */}
              </table>
            </div>

            {/* Kitchen Prep Table - Only shown for Main Kitchen department */}
            {selectedDepartment === 'Main Kitchen' && (
              <>
                <div style={{ marginTop: '40px', marginBottom: '20px' }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: '#006400', 
                    textAlign: 'center',
                    margin: '0 0 20px 0' 
                  }}>
                    KITCHEN PREP ITEMS
                  </h3>
                </div>
                
                <div style={{ 
                  overflow: 'auto', 
                  border: '1px solid #d3d3d3',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse',
                    fontSize: '12px'
                  }}>
                    <thead>
                      <tr style={{ background: 'linear-gradient(135deg, rgba(0,100,0,0.2), rgba(74,103,65,0.15))' }}>
                        <th style={{ 
                          position: 'sticky', 
                          left: 0, 
                          width: '200px', 
                          padding: '16px 12px', 
                          backgroundColor: 'linear-gradient(135deg, rgba(0,100,0,0.2), rgba(74,103,65,0.15))', 
                          borderRight: '2px solid #d3d3d3',
                          color: '#006400', 
                          fontWeight: '900',
                          fontSize: '15px', 
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textAlign: 'left',
                          border: '1px solid #d3d3d3',
                          textTransform: 'uppercase'
                        }}>
                          Item
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Beg
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Prod
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Del
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Used
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Cashier
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Bar
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Kitchen
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          1B
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Sold
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Event
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Spoil
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Return
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Short
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Over
                        </th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '16px 8px', 
                          color: '#006400', 
                          fontWeight: '800', 
                          fontSize: '11px', 
                          width: '60px',
                          border: '1px solid #d3d3d3',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Ending
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {kitchenPrepData.map((row, index) => (
                        <tr key={row.id} style={{ 
                          borderBottom: '1px solid rgba(156,175,136,0.2)'
                        }}>
                          {/* Item Name - Fixed column */}
                          <td style={{ 
                            position: 'sticky', 
                            left: 0, 
                            padding: '8px', 
                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                            borderRight: '2px solid #d3d3d3',
                            fontWeight: '600',
                            fontSize: '15px',
                            color: '#4A6741',
                            border: '1px solid #d3d3d3',
                            minWidth: '150px',
                            boxSizing: 'border-box'
                          }}>
                            {row.item}
                          </td>

                          {/* Beg - Editable */}
                          <td style={{ 
                            padding: '2px', 
                            width: '60px',
                            border: '1px solid #d3d3d3',
                            background: '#fff'
                          }}>
                            <input
                              id={`kitchen-prep-cell-${index}-0`}
                              type="number"
                              value={row.beg}
                              onChange={(e) => {
                                handleKitchenPrepInputChange(row.id, 'beg', e.target.value);
                                setTimeout(() => updateKitchenPrepEndingCalculation(row.id), 10);
                              }}
                              onKeyDown={(e) => handleKitchenPrepKeyDown(e, index, 0)} onWheel={(e) => (e.target as HTMLInputElement).blur()}
                              style={{
                                width: '100%',
                                border: 'none',
                                background: 'transparent',
                                padding: '12px 4px',
                                borderRadius: '0',
                                fontSize: '15px',
                                fontWeight: '700',
                                color: '#2196F3',
                                outline: 'none',
                                textAlign: 'center',
                                boxSizing: 'border-box',
                                fontFamily: 'Arial, sans-serif',
                                letterSpacing: '0px',
                                lineHeight: 'normal',
                                height: 'auto',
                                minHeight: '20px',
                                display: 'block'
                              }}
                              onFocus={(e) => {
                                e.target.style.background = 'rgba(33,150,243,0.1)';
                                e.target.style.boxShadow = 'inset 0 0 0 2px rgba(33,150,243,0.5)';
                                e.target.select();
                                setFocusedCell({ row: index, col: 0 });
                              }}
                              onBlur={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.boxShadow = 'none';
                              }}
                            />
                            <span className="print-value" style={{ display: 'none', textAlign: 'center', fontSize: '9px' }}>{row.beg}</span>
                          </td>

                          {/* Production - Editable */}
                          <td style={{ 
                            padding: '2px', 
                            width: '60px',
                            border: '1px solid #d3d3d3',
                            background: '#fff'
                          }}>
                            <input
                              id={`kitchen-prep-cell-${index}-1`}
                              type="number"
                              value={row.production === 0 ? '' : row.production}
                              onChange={(e) => {
                                handleKitchenPrepInputChange(row.id, 'production', e.target.value);
                                setTimeout(() => updateKitchenPrepEndingCalculation(row.id), 10);
                              }}
                              onKeyDown={(e) => handleKitchenPrepKeyDown(e, index, 1)} onWheel={(e) => (e.target as HTMLInputElement).blur()}
                              style={{
                                width: '100%',
                                border: 'none',
                                background: 'transparent',
                                padding: '12px 4px',
                                borderRadius: '0',
                                fontSize: '15px',
                                fontWeight: '700',
                                color: '#4CAF50',
                                outline: 'none',
                                textAlign: 'center',
                                boxSizing: 'border-box'
                              }}
                              onFocus={(e) => {
                                e.target.style.background = 'rgba(76,175,80,0.1)';
                                e.target.style.boxShadow = 'inset 0 0 0 2px rgba(76,175,80,0.5)';
                                e.target.select();
                                setFocusedCell({ row: index, col: 1 });
                              }}
                              onBlur={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.boxShadow = 'none';
                              }}
                            />
                          </td>

                          {/* Used - Editable */}
                          <td style={{ 
                            padding: '2px', 
                            width: '60px',
                            border: '1px solid #d3d3d3',
                            background: '#fff'
                          }}>
                            <input
                              id={`kitchen-prep-cell-${index}-2`}
                              type="number"
                              value={row.used === 0 ? '' : row.used}
                              onChange={(e) => {
                                handleKitchenPrepInputChange(row.id, 'used', e.target.value);
                                setTimeout(() => updateKitchenPrepEndingCalculation(row.id), 10);
                              }}
                              onKeyDown={(e) => handleKitchenPrepKeyDown(e, index, 2)} onWheel={(e) => (e.target as HTMLInputElement).blur()}
                              style={{
                                width: '100%',
                                border: 'none',
                                background: 'transparent',
                                padding: '12px 4px',
                                borderRadius: '0',
                                fontSize: '15px',
                                fontWeight: '700',
                                color: '#FF5722',
                                outline: 'none',
                                textAlign: 'center',
                                boxSizing: 'border-box'
                              }}
                              onFocus={(e) => {
                                e.target.style.background = 'rgba(255,87,34,0.1)';
                                e.target.style.boxShadow = 'inset 0 0 0 2px rgba(255,87,34,0.5)';
                                e.target.select();
                                setFocusedCell({ row: index, col: 1 });
                              }}
                              onBlur={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.boxShadow = 'none';
                              }}
                            />
                          </td>

                          {/* Kitchen - Editable */}
                          <td style={{ 
                            padding: '2px', 
                            width: '60px',
                            border: '1px solid #d3d3d3',
                            background: '#fff'
                          }}>
                            <input
                              id={`kitchen-prep-cell-${index}-2`}
                              type="number"
                              value={row.kitchen === 0 ? '' : row.kitchen}
                              onChange={(e) => {
                                handleKitchenPrepInputChange(row.id, 'kitchen', e.target.value);
                                setTimeout(() => updateKitchenPrepEndingCalculation(row.id), 10);
                              }}
                              onKeyDown={(e) => handleKitchenPrepKeyDown(e, index, 3)} onWheel={(e) => (e.target as HTMLInputElement).blur()}
                              style={{
                                width: '100%',
                                border: 'none',
                                background: 'transparent',
                                padding: '12px 4px',
                                borderRadius: '0',
                                fontSize: '15px',
                                fontWeight: '700',
                                color: '#9C27B0',
                                outline: 'none',
                                textAlign: 'center',
                                boxSizing: 'border-box'
                              }}
                              onFocus={(e) => {
                                e.target.style.background = 'rgba(156,39,176,0.1)';
                                e.target.style.boxShadow = 'inset 0 0 0 2px rgba(147,51,234,0.5)';
                                e.target.select();
                                setFocusedCell({ row: index, col: 1 });
                              }}
                              onBlur={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.boxShadow = 'none';
                              }}
                            />
                          </td>

                          {/* One Balete - Editable */}
                          <td style={{ 
                            padding: '2px', 
                            width: '60px',
                            border: '1px solid #d3d3d3',
                            background: '#fff'
                          }}>
                            <input
                              id={`kitchen-prep-cell-${index}-3`}
                              type="number"
                              value={row.oneBalete === 0 ? '' : row.oneBalete}
                              onChange={(e) => {
                                handleKitchenPrepInputChange(row.id, 'oneBalete', e.target.value);
                                setTimeout(() => updateKitchenPrepEndingCalculation(row.id), 10);
                              }}
                              onKeyDown={(e) => handleKitchenPrepKeyDown(e, index, 4)} onWheel={(e) => (e.target as HTMLInputElement).blur()}
                              style={{
                                width: '100%',
                                border: 'none',
                                background: 'transparent',
                                padding: '12px 4px',
                                borderRadius: '0',
                                fontSize: '15px',
                                fontWeight: '700',
                                color: '#FF9800',
                                outline: 'none',
                                textAlign: 'center',
                                boxSizing: 'border-box'
                              }}
                              onFocus={(e) => {
                                e.target.style.background = 'rgba(234,88,12,0.1)';
                                e.target.style.boxShadow = 'inset 0 0 0 2px rgba(234,88,12,0.5)';
                                e.target.select();
                                setFocusedCell({ row: index, col: 3 });
                              }}
                              onBlur={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.boxShadow = 'none';
                              }}
                            />
                          </td>

                          {/* Foodtrays - Editable */}
                          <td style={{ 
                            padding: '2px', 
                            width: '60px',
                            border: '1px solid #d3d3d3',
                            background: '#fff'
                          }}>
                            <input
                              id={`kitchen-prep-cell-${index}-4`}
                              type="number"
                              value={row.foodtrays === 0 ? '' : row.foodtrays}
                              onChange={(e) => {
                                handleKitchenPrepInputChange(row.id, 'foodtrays', e.target.value);
                                setTimeout(() => updateKitchenPrepEndingCalculation(row.id), 10);
                              }}
                              onKeyDown={(e) => handleKitchenPrepKeyDown(e, index, 5)} onWheel={(e) => (e.target as HTMLInputElement).blur()}
                              style={{
                                width: '100%',
                                border: 'none',
                                background: 'transparent',
                                padding: '12px 4px',
                                borderRadius: '0',
                                fontSize: '15px',
                                fontWeight: '700',
                                color: '#00BCD4',
                                outline: 'none',
                                textAlign: 'center',
                                boxSizing: 'border-box'
                              }}
                              onFocus={(e) => {
                                e.target.style.background = 'rgba(8,145,178,0.1)';
                                e.target.style.boxShadow = 'inset 0 0 0 2px rgba(8,145,178,0.5)';
                                e.target.select();
                                setFocusedCell({ row: index, col: 4 });
                              }}
                              onBlur={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.boxShadow = 'none';
                              }}
                            />
                          </td>

                          {/* Event - Editable */}
                          <td style={{ 
                            padding: '2px', 
                            width: '60px',
                            border: '1px solid #d3d3d3',
                            background: '#fff'
                          }}>
                            <input
                              id={`kitchen-prep-cell-${index}-5`}
                              type="number"
                              value={row.event === 0 ? '' : row.event}
                              onChange={(e) => {
                                handleKitchenPrepInputChange(row.id, 'event', e.target.value);
                                setTimeout(() => updateKitchenPrepEndingCalculation(row.id), 10);
                              }}
                              onKeyDown={(e) => handleKitchenPrepKeyDown(e, index, 6)} onWheel={(e) => (e.target as HTMLInputElement).blur()}
                              style={{
                                width: '100%',
                                border: 'none',
                                background: 'transparent',
                                padding: '12px 4px',
                                borderRadius: '0',
                                fontSize: '15px',
                                fontWeight: '700',
                                color: '#673AB7',
                                outline: 'none',
                                textAlign: 'center',
                                boxSizing: 'border-box'
                              }}
                              onFocus={(e) => {
                                e.target.style.background = 'rgba(124,58,237,0.1)';
                                e.target.style.boxShadow = 'inset 0 0 0 2px rgba(124,58,237,0.5)';
                                e.target.select();
                                setFocusedCell({ row: index, col: 5 });
                              }}
                              onBlur={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.boxShadow = 'none';
                              }}
                            />
                          </td>

                          {/* Spoilage - Editable */}
                          <td style={{ 
                            padding: '2px', 
                            width: '60px',
                            border: '1px solid #d3d3d3',
                            background: '#fff'
                          }}>
                            <input
                              id={`kitchen-prep-cell-${index}-6`}
                              type="number"
                              value={row.spoilage === 0 ? '' : row.spoilage}
                              onChange={(e) => {
                                handleKitchenPrepInputChange(row.id, 'spoilage', e.target.value);
                                setTimeout(() => updateKitchenPrepEndingCalculation(row.id), 10);
                              }}
                              onKeyDown={(e) => handleKitchenPrepKeyDown(e, index, 7)} onWheel={(e) => (e.target as HTMLInputElement).blur()}
                              style={{
                                width: '100%',
                                border: 'none',
                                background: 'transparent',
                                padding: '12px 4px',
                                borderRadius: '0',
                                fontSize: '15px',
                                fontWeight: '700',
                                color: '#F44336',
                                outline: 'none',
                                textAlign: 'center',
                                boxSizing: 'border-box'
                              }}
                              onFocus={(e) => {
                                e.target.style.background = 'rgba(190,24,93,0.1)';
                                e.target.style.boxShadow = 'inset 0 0 0 2px rgba(190,24,93,0.5)';
                                e.target.select();
                                setFocusedCell({ row: index, col: 6 });
                              }}
                              onBlur={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.boxShadow = 'none';
                              }}
                            />
                          </td>

                          {/* Return - Editable */}
                          <td style={{ 
                            padding: '2px', 
                            width: '60px',
                            border: '1px solid #d3d3d3',
                            background: '#fff'
                          }}>
                            <input
                              id={`kitchen-prep-cell-${index}-7`}
                              type="number"
                              value={row.return === 0 ? '' : row.return}
                              onChange={(e) => {
                                handleKitchenPrepInputChange(row.id, 'return', e.target.value);
                                setTimeout(() => updateKitchenPrepEndingCalculation(row.id), 10);
                              }}
                              onKeyDown={(e) => handleKitchenPrepKeyDown(e, index, 8)} onWheel={(e) => (e.target as HTMLInputElement).blur()}
                              style={{
                                width: '100%',
                                border: 'none',
                                background: 'transparent',
                                padding: '12px 4px',
                                borderRadius: '0',
                                fontSize: '15px',
                                fontWeight: '700',
                                color: '#2196F3',
                                outline: 'none',
                                textAlign: 'center',
                                boxSizing: 'border-box'
                              }}
                              onFocus={(e) => {
                                e.target.style.background = 'rgba(5,150,105,0.1)';
                                e.target.style.boxShadow = 'inset 0 0 0 2px rgba(5,150,105,0.5)';
                                e.target.select();
                                setFocusedCell({ row: index, col: 7 });
                              }}
                              onBlur={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.boxShadow = 'none';
                              }}
                            />
                          </td>

                          {/* Ending - Auto-calculated, focusable but non-editable */}
                          <td style={{ 
                            padding: '2px', 
                            width: '60px',
                            border: '1px solid #d3d3d3',
                            background: 'rgba(46,125,50,0.05)'
                          }}>
                            <div
                              id={`kitchen-prep-cell-${index}-9`}
                              tabIndex={0}
                              onKeyDown={(e) => handleKitchenPrepKeyDown(e, index, 9)} onWheel={(e) => (e.target as HTMLInputElement).blur()}
                              style={{
                                width: '100%',
                                padding: '12px 4px',
                                borderRadius: '0',
                                fontSize: '15px',
                                fontWeight: '700',
                                color: '#2E7D32',
                                textAlign: 'center',
                                outline: 'none',
                                cursor: 'default',
                                boxSizing: 'border-box'
                              }}
                              onFocus={(e) => {
                                e.target.style.background = 'rgba(46,125,50,0.2)';
                                e.target.style.boxShadow = 'inset 0 0 0 2px rgba(46,125,50,0.5)';
                                setFocusedCell({ row: index, col: 9 });
                              }}
                              onBlur={(e) => {
                                e.target.style.background = 'rgba(46,125,50,0.05)';
                                e.target.style.boxShadow = 'none';
                              }}
                            >
                              {calculateEnding(row)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ 
                        background: 'rgba(0,100,0,0.05)', 
                        fontWeight: '700',
                            fontSize: '15px',
                        borderTop: '3px solid #006400',
                        borderBottom: '2px solid #006400'
                      }}>
                        <td style={{ 
                          padding: '16px 12px', 
                          color: '#006400', 
                          fontWeight: '900',
                          fontFamily: 'Arial, sans-serif',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          border: '1px solid #006400',
                          backgroundColor: 'rgba(0,100,0,0.05)'
                        }}>
                          KITCHEN PREP TOTAL
                        </td>
                        <td style={{ 
                          padding: '12px 4px', 
                          textAlign: 'center',
                          color: '#2196F3',
                          border: '1px solid #d3d3d3',
                          fontSize: '11px'
                        }}>
                          {kitchenPrepData.reduce((sum, item) => sum + item.beg, 0)}
                        </td>
                        <td style={{ 
                          padding: '12px 4px', 
                          textAlign: 'center',
                          color: '#4CAF50',
                          border: '1px solid #d3d3d3',
                          fontSize: '11px'
                        }}>
                          {kitchenPrepData.reduce((sum, item) => sum + item.production, 0)}
                        </td>
                        <td style={{ 
                          padding: '12px 4px', 
                          textAlign: 'center',
                          color: '#FF5722',
                          border: '1px solid #d3d3d3',
                          fontSize: '11px'
                        }}>
                          {kitchenPrepData.reduce((sum, item) => sum + item.used, 0)}
                        </td>
                        <td style={{ 
                          padding: '12px 4px', 
                          textAlign: 'center',
                          color: '#9C27B0',
                          border: '1px solid #d3d3d3',
                          fontSize: '11px'
                        }}>
                          {kitchenPrepData.reduce((sum, item) => sum + item.kitchen, 0)}
                        </td>
                        <td style={{ 
                          padding: '12px 4px', 
                          textAlign: 'center',
                          color: '#FF9800',
                          border: '1px solid #d3d3d3',
                          fontSize: '11px'
                        }}>
                          {kitchenPrepData.reduce((sum, item) => sum + item.oneBalete, 0)}
                        </td>
                        <td style={{ 
                          padding: '12px 4px', 
                          textAlign: 'center',
                          color: '#00BCD4',
                          border: '1px solid #d3d3d3',
                          fontSize: '11px'
                        }}>
                          {kitchenPrepData.reduce((sum, item) => sum + item.foodtrays, 0)}
                        </td>
                        <td style={{ 
                          padding: '12px 4px', 
                          textAlign: 'center',
                          color: '#673AB7',
                          border: '1px solid #d3d3d3',
                          fontSize: '11px'
                        }}>
                          {kitchenPrepData.reduce((sum, item) => sum + item.event, 0)}
                        </td>
                        <td style={{ 
                          padding: '12px 4px', 
                          textAlign: 'center',
                          color: '#F44336',
                          border: '1px solid #d3d3d3',
                          fontSize: '11px'
                        }}>
                          {kitchenPrepData.reduce((sum, item) => sum + item.spoilage, 0)}
                        </td>
                        <td style={{ 
                          padding: '12px 4px', 
                          textAlign: 'center',
                          color: '#2196F3',
                          border: '1px solid #d3d3d3',
                          fontSize: '11px'
                        }}>
                          {kitchenPrepData.reduce((sum, item) => sum + item.return, 0)}
                        </td>
                        <td style={{ 
                          padding: '12px 4px', 
                          textAlign: 'center',
                          color: '#2E7D32',
                          border: '1px solid #d3d3d3',
                          fontSize: '11px'
                        }}>
                          {kitchenPrepData.reduce((sum, item) => sum + calculateEnding(item), 0)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </>
            )}

            {/* Add blank space below table for print */}
            <div className="print-blank-space" style={{ height: '48px', display: 'none' }}></div>

            {/* Signature Input Section - Only shown on screen, not in print */}
            {/* Signature Input Section - visible on screen and print for report */}
            <div 
              style={{
                marginTop: '30px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '40px',
                paddingTop: '20px'
              }}
            >
              {/* Transfer Encoded By Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label 
                  className="print-encoded-label"
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4A6741'
                  }}
                >
                  Transfer Encoded By:
                </label>
                <input
                  type="text"
                  value={transferEncodedBy}
                  onChange={(e) => setTransferEncodedBy(e.target.value)}
                  placeholder="Enter name..."
                  className="print-encoded-input"
                  style={{
                    border: '1px solid #9CAF88',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '14px',
                    color: '#4A6741',
                    outline: 'none',
                    background: 'rgba(255, 255, 255, 0.8)'
                  }}
                />
              </div>

              {/* Prod Encoded and Inventory Rechecked By Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label 
                  className="print-encoded-label"
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4A6741'
                  }}
                >
                  Prod Encoded and Inventory Rechecked By:
                </label>
                <input
                  type="text"
                  value={prodEncodedBy}
                  onChange={(e) => setProdEncodedBy(e.target.value)}
                  placeholder="Enter name..."
                  className="print-encoded-input"
                  style={{
                    border: '1px solid #9CAF88',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '14px',
                    color: '#4A6741',
                    outline: 'none',
                    background: 'rgba(255, 255, 255, 0.8)'
                  }}
                />
      <style>{`
        @media print {
          .print-encoded-label {
            font-size: 12px !important;
          }
          .print-encoded-input {
            font-size: 13px !important;
          }
          .print-blank-space {
            display: block !important;
            height: 48px;
          }
        }
        @media screen {
          .print-blank-space {
            display: none !important;
          }
        }
      `}</style>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div 
          className="summary-cards"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '32px'
          }}
        >
          {[
            { 
              icon: '🏭', 
              title: 'Total Production', 
              value: productionData.reduce((sum, item) => sum + item.production, 0), 
              color: '#4CAF50',
              desc: 'Items produced today'
            },
            { 
              icon: '📦', 
              title: 'Total Used', 
              value: productionData.reduce((sum, item) => sum + item.used, 0), 
              color: '#FF5722',
              desc: 'Items distributed'
            },
            { 
              icon: '🏪', 
              title: 'Ending Stock', 
              value: productionData.reduce((sum, item) => sum + calculateEnding(item), 0), 
              color: '#2E7D32',
              desc: 'Items remaining'
            },
            { 
              icon: '⚡', 
              title: 'Items Count', 
              value: productionData.length, 
              color: '#FF9800',
              desc: 'Active products'
            },
            { 
              icon: '⬇️', 
              title: 'Total Short', 
              value: productionData.reduce((sum, item) => sum + item.short, 0), 
              color: '#f7f2b7ff',
              desc: 'Short variance today'
            },
            { 
              icon: '⬆️', 
              title: 'Total Over', 
              value: productionData.reduce((sum, item) => sum + item.over, 0), 
              color: '#f7f2b7ff',
              desc: 'Over variance today'
            }
          ].map((card, index) => (
            <div 
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(156,175,136,0.2)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  top: '-1px',
                  left: '-1px',
                  right: '-1px',
                  bottom: '-1px',
                  background: `linear-gradient(135deg, ${card.color}15, ${card.color}08)`,
                  borderRadius: '16px',
                  zIndex: -1
                }}
              />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div 
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: card.color,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    boxShadow: `0 6px 16px ${card.color}40`
                  }}
                >
                  {card.icon}
                </div>
                <div>
                  <p style={{ color: '#4A6741', fontWeight: '600', margin: '0 0 4px 0', fontSize: '11px' }}>{card.title}</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#006400', margin: '0 0 4px 0' }}>{card.value}</p>
                  <p style={{ fontSize: '12px', color: '#9CAF88', margin: 0 }}>{card.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      </>
    )
  );
}
