'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();
  // Scroll to top when dashboard loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('Both Branches');
  const [startDate, setStartDate] = useState('2025-08-01');
  const [endDate, setEndDate] = useState('2025-08-07');
  const [dateRange, setDateRange] = useState('This Week');
  const [username, setUsername] = useState('Admin');
  // Multi-step selection state for Inventory (must be inside function component)
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [inventoryStep, setInventoryStep] = useState(0); // 0: Branch, 1: Group, 2: Department
  const [selectedInventoryBranch, setSelectedInventoryBranch] = useState('');
  const [selectedInventoryGroup, setSelectedInventoryGroup] = useState('');
  const [selectedInventoryDepartment, setSelectedInventoryDepartment] = useState('');
  const [showCountedCheckedModal, setShowCountedCheckedModal] = useState(false);
  const [modalCountedBy, setModalCountedBy] = useState('');
  const [modalCheckedBy, setModalCheckedBy] = useState('');
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [selectedWarehouseGroup, setSelectedWarehouseGroup] = useState('');

  // Check for persisted login state on component mount
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setIsLoggedIn(true);
            setUsername(data.user.username || 'Admin');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsHydrated(true);
      }
    };

    checkUserSession();
  }, []);

  // Handle login success
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/session', {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
    setIsLoggedIn(false);
    setUsername('Admin');
  window.location.href = '/';
  };

  const handleWarehouseClick = () => {
    setShowWarehouseModal(true);
  };

  const handleWarehouseGroupSelect = (group: string) => {
    setSelectedWarehouseGroup(group);
    setShowWarehouseModal(false);
    if (group === 'RawMats') {
      window.location.href = '/warehouse-inventory?group=RawMats';
    } else if (group === 'NonFood') {
      window.location.href = '/warehouse-nonfood';
    }
    // You can add more navigation logic for NonFood if needed
  };

  const goToInventoryInput = () => {
    window.location.href = `/inventory-input?branch=${encodeURIComponent(selectedInventoryBranch)}&group=${encodeURIComponent(selectedInventoryGroup)}&department=${encodeURIComponent(selectedInventoryDepartment)}&countedBy=${encodeURIComponent(modalCountedBy)}&checkedBy=${encodeURIComponent(modalCheckedBy)}&username=${encodeURIComponent(username)}`;
  };

  if (!isHydrated) {
    return null; // Prevent hydration mismatch
  }



  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fdf8 0%, #f0f8f0 25%, #e8f5e8 50%, #f2f9f2 75%, #fafdfb 100%)',
        position: 'relative'
      }}
    >
      {/* Elegant Background Pattern */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(156,175,136,0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 40%, rgba(74,103,65,0.06) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(0,100,0,0.04) 0%, transparent 50%),
            linear-gradient(45deg, transparent 48%, rgba(156,175,136,0.02) 49%, rgba(156,175,136,0.02) 51%, transparent 52%)
          `,
          backgroundSize: '400px 400px, 600px 600px, 500px 500px, 100px 100px',
          pointerEvents: 'none'
        }}
      />
      
      {/* Subtle Geometric Accents */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 100px,
              rgba(156,175,136,0.5) 100px,
              rgba(156,175,136,0.5) 101px
            )
          `,
          pointerEvents: 'none'
        }}
      />
      {/* Header */}
      <header 
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
            padding: '20px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div 
              style={{
                width: '48px',
                height: '48px',
                minWidth: '48px',
                minHeight: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(74,103,65,0.4)',
                overflow: 'hidden',
                background: 'white',
                marginRight: '8px',
              }}
            >
              <img 
                src="/images/logo.png" 
                alt="ESMERALDA Finance Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  maxWidth: '48px',
                  maxHeight: '48px',
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
                style={{
                  color: '#4A6741',
                  margin: 0,
                  fontSize: '14px'
                }}
              >
                Business Management Dashboard
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end', width: '100%' }}>
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '6px 12px',
                borderRadius: '50px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#006400',
                fontWeight: '600',
                fontSize: '0.95rem',
                marginBottom: '6px',
                minWidth: '120px',
                textAlign: 'center',
              }}
            >
              👋 Welcome, {username}
            </div>
            <button 
              onClick={handleLogout}
              style={{
                background: 'linear-gradient(135deg, #9CAF88, #4A6741)',
                color: 'white',
                padding: '10px 18px',
                borderRadius: '50px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(74,103,65,0.3)',
                fontSize: '0.95rem',
                marginBottom: '6px',
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(-2px)';
                target.style.boxShadow = '0 8px 25px rgba(74,103,65,0.4)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = '0 4px 15px rgba(74,103,65,0.3)';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

     
      
         

        {/* Main Dashboard Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '18px',
            paddingLeft: '5vw',
            paddingRight: '5vw',
            gridAutoRows: '1fr',
          }}
        >
          {[
      { icon: '💼', title: 'Daily Sales', desc: 'Generate sales reports', color: '#9CAF88', path: '/sales-input-page' },
      { icon: '📦', title: 'Inventory', desc: 'Month-End Inventory', color: '#4A6741', path: '/inventory-input', isInventory: true },
      { icon: '🍳', title: 'Production', desc: 'Food preparation', color: '#006400', path: '/production' },
  { icon: '🛒', title: 'Purchases', desc: 'Supplier orders', color: '#9CAF88', path: '/purchases' },
        { icon: '📤', title: 'Transfers', desc: 'Warehouse transfers', color:'#4A6741', path: '/transfers' },
        { icon: '🏭', title: 'Warehouse', desc: 'Warehouse Inventory', color: '#38b2ac', path: '/warehouse-inventory', isWarehouse: true },
        { icon: '📊', title: 'Reports', desc: 'Analytics & insights', color: '#FF6B35', path: '/reports' },
         { icon: '⚙️', title: 'Settings', desc: 'Configure application settings', color: '#6b7280', path: '/settings' } // Changed to gray
              ].map((action, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    if (action.isInventory) {
                      setShowInventoryModal(true);
                      setInventoryStep(0);
                    } else if (action.title === 'Settings') {
                      setShowSettingsModal(true);
                    } else if (action.title === 'Warehouse') {
                      setShowWarehouseModal(true);
                    } else {
                      router.push(action.path);
                    }
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${action.color}, ${action.color}DD)`,
                    borderRadius: '16px',
                    padding: '10px',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: `0 8px 20px ${action.color}40`,
                    position: 'relative',
                    overflow: 'hidden',
                    minWidth: '0',
                    width: '100%',
                    maxWidth: '340px',
                    margin: '0 auto',
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget as HTMLDivElement;
                    target.style.transform = 'translateY(-4px) scale(1.02)';
                    target.style.boxShadow = `0 15px 35px ${action.color}50`;
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget as HTMLDivElement;
                    target.style.transform = 'translateY(0) scale(1)';
                    target.style.boxShadow = `0 8px 20px ${action.color}40`;
                  }}
                >
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px'
                    }}
                  >
                    <div style={{ fontSize: '32px' }}>{action.icon}</div>
                    <div 
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px'
                      }}
                    >
                      →
                    </div>
                  </div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '16px', margin: '0 0 8px 0' }}>{action.title}</h3>
                  <p style={{ fontSize: '14px', margin: 0, opacity: 0.9 }}>{action.desc}</p>
                </div>
              ))}
            {/* Inventory Multi-step Modal */}
            {/* Settings Modal */}
            {showSettingsModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.25)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                boxSizing: 'border-box',
              }}>
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px 12px',
                  width: '100%',
                  maxWidth: '340px',
                  boxShadow: '0 8px 32px rgba(74,103,65,0.18)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '18px',
                  position: 'relative',
                  minHeight: '180px',
                }}>
                  <button
                    style={{
                      position: 'absolute',
                      top: '18px',
                      right: '18px',
                      background: 'none',
                      border: 'none',
                      fontSize: '22px',
                      color: '#4A6741',
                      cursor: 'pointer',
                      zIndex: 10,
                    }}
                    aria-label="Close"
                    onClick={() => setShowSettingsModal(false)}
                  >
                    ×
                  </button>
                  <h2 style={{ color: '#4A6741', fontWeight: 'bold', fontSize: '20px', marginBottom: '12px' }}>Settings</h2>
                  <div style={{ display: 'flex', gap: '18px', marginBottom: '8px', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '8px', alignItems: 'center', width: '100%' }}>
                      <button
                        style={{
                          background: '#A3B18A',
                          color: 'white',
                          border: '1px solid #A3B18A',
                          borderRadius: '8px',
                          padding: '12px 32px',
                          fontWeight: '600',
                          fontSize: '16px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px #A3B18A40',
                          transition: 'all 0.2s',
                          width: '100%',
                          maxWidth: '220px',
                        }}
                        onClick={() => { window.location.href = '/items'; }}
                      >ITEMS</button>
                      <button
                        style={{
                          background: '#A3B18A',
                          color: 'white',
                          border: '1px solid #A3B18A',
                          borderRadius: '8px',
                          padding: '12px 32px',
                          fontWeight: '600',
                          fontSize: '16px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px #A3B18A40',
                          transition: 'all 0.2s',
                          width: '100%',
                          maxWidth: '220px',
                        }}
                        onClick={() => { window.location.href = '/nonfooditems'; }}
                      >NON-FOOD</button>
                      <button
                        style={{
                          background: '#A3B18A',
                          color: 'white',
                          border: '1px solid #A3B18A',
                          borderRadius: '8px',
                          padding: '12px 32px',
                          fontWeight: '600',
                          fontSize: '16px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px #A3B18A40',
                          transition: 'all 0.2s',
                          width: '100%',
                          maxWidth: '220px',
                          marginTop: '2px',
                        }}
                        onClick={() => { window.location.href = '/purchases-dashboard'; }}
                      >PURCHASES & TRANSFERS</button>
                      <button
                        style={{
                          background: '#A3B18A',
                          color: 'white',
                          border: '1px solid #A3B18A',
                          borderRadius: '8px',
                          padding: '12px 32px',
                          fontWeight: '600',
                          fontSize: '16px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px #A3B18A40',
                          transition: 'all 0.2s',
                          width: '100%',
                          maxWidth: '220px',
                        }}
                        onClick={() => { window.location.href = '/user-maintenance'; }}
                      >USER</button>
                      <button
                        style={{
                          background: '#A3B18A',
                          color: 'white',
                          border: '1px solid #A3B18A',
                          borderRadius: '8px',
                          padding: '12px 32px',
                          fontWeight: '600',
                          fontSize: '16px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px #A3B18A40',
                          transition: 'all 0.2s',
                          width: '100%',
                          maxWidth: '220px',
                        }}
                        onClick={() => { /* TODO: Implement backup logic */ alert('BACK UP clicked!'); }}
                      >BACK UP</button>
                      <button
                        style={{
                          background: '#A3B18A',
                          color: 'white',
                          border: '1px solid #A3B18A',
                          borderRadius: '8px',
                          padding: '12px 32px',
                          fontWeight: '600',
                          fontSize: '16px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px #A3B18A40',
                          transition: 'all 0.2s',
                          width: '100%',
                          maxWidth: '220px',
                        }}
                        onClick={() => { /* TODO: Implement reset logic */ alert('RESET clicked!'); }}
                      >RESET</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showInventoryModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.25)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                boxSizing: 'border-box',
              }}>
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px 12px',
                  width: '100%',
                  maxWidth: '370px',
                  boxShadow: '0 8px 32px rgba(74,103,65,0.18)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '18px',
                  position: 'relative',
                  minHeight: '320px',
                }}>
                  <button
                    style={{
                      position: 'absolute',
                      top: '18px',
                      right: '18px',
                      background: 'none',
                      border: 'none',
                      fontSize: '22px',
                      color: '#4A6741',
                      cursor: 'pointer',
                      zIndex: 10,
                    }}
                    aria-label="Close"
                    onClick={() => setShowInventoryModal(false)}
                  >
                    ×
                  </button>
                  <h2 style={{ color: '#4A6741', fontWeight: 'bold', fontSize: '20px', marginBottom: '12px' }}>Inventory Selection</h2>
                  {inventoryStep === 0 && (
                    <>
                      <div style={{ fontWeight: '600', marginBottom: '18px', marginTop: '-10px' }}>Select Branch:</div>
                      <div style={{ display: 'flex', gap: '18px', marginBottom: '8px' }}>
                        <button
                          style={{
                            background: selectedInventoryBranch === 'Mayon' ? '#4A6741' : '#E8F5E8',
                            color: selectedInventoryBranch === 'Mayon' ? 'white' : '#4A6741',
                            border: '1px solid #9CAF88',
                            borderRadius: '8px',
                            padding: '12px 0',
                            width: '48%',
                            minWidth: '120px',
                            fontWeight: '600',
                            fontSize: '16px',
                            cursor: 'pointer',
                            boxShadow: selectedInventoryBranch === 'Mayon' ? '0 4px 12px #4A674140' : 'none',
                            transition: 'all 0.2s',
                          }}
                          onClick={() => {
                            setSelectedInventoryBranch('Mayon');
                            setInventoryStep(1);
                          }}
                        >Mayon</button>
                        <button
                          style={{
                            background: selectedInventoryBranch === 'One Balete' ? '#4A6741' : '#E8F5E8',
                            color: selectedInventoryBranch === 'One Balete' ? 'white' : '#4A6741',
                            border: '1px solid #9CAF88',
                            borderRadius: '8px',
                            padding: '12px 0',
                            width: '48%',
                            minWidth: '120px',
                            fontWeight: '600',
                            fontSize: '16px',
                            cursor: 'pointer',
                            boxShadow: selectedInventoryBranch === 'One Balete' ? '0 4px 12px #4A674140' : 'none',
                            transition: 'all 0.2s',
                          }}
                          onClick={() => {
                            setSelectedInventoryBranch('One Balete');
                            setInventoryStep(1);
                          }}
                        >One Balete</button>
                      </div>
                    </>
                  )}
                  {inventoryStep === 1 && (
                    <>
                      <div style={{ fontWeight: '600', marginBottom: '18px', marginTop: '-10px' }}>Select Group:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '8px', justifyContent: 'center' }}>
                        <button
                          style={{
                            background: selectedInventoryGroup === 'RawMats' ? '#4A6741' : '#E8F5E8',
                            color: selectedInventoryGroup === 'RawMats' ? 'white' : '#4A6741',
                            border: '1px solid #9CAF88',
                            borderRadius: '8px',
                            padding: '12px 32px',
                            fontWeight: '600',
                            fontSize: '16px',
                            cursor: 'pointer',
                            boxShadow: selectedInventoryGroup === 'RawMats' ? '0 4px 12px #4A674140' : 'none',
                            transition: 'all 0.2s',
                          }}
                          onClick={() => {
                            setSelectedInventoryGroup('RawMats');
                            setInventoryStep(2);
                          }}
                        >RawMats</button>
                        <button
                          style={{
                            background: selectedInventoryGroup === 'NonFood' ? '#4A6741' : '#E8F5E8',
                            color: selectedInventoryGroup === 'NonFood' ? 'white' : '#4A6741',
                            border: '1px solid #9CAF88',
                            borderRadius: '8px',
                            padding: '12px 32px',
                            fontWeight: '600',
                            fontSize: '16px',
                            cursor: 'pointer',
                            boxShadow: selectedInventoryGroup === 'NonFood' ? '0 4px 12px #4A674140' : 'none',
                            transition: 'all 0.2s',
                          }}
                          onClick={() => {
                            setSelectedInventoryGroup('NonFood');
                            setInventoryStep(2);
                          }}
                        >NonFood</button>
                      </div>
                    </>
                  )}
                  {inventoryStep === 2 && (
                    <>
                      <div style={{ fontWeight: '600', marginBottom: '18px', marginTop: '-10px' }}>Select Department:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '8px', justifyContent: 'center' }}>
                        {(
                          selectedInventoryGroup === 'RawMats'
                            ? ['Bakery', 'Bar', 'Cashier', 'Commissary', 'Dessert', 'Kitchen', 'Warehouse']
                            : ['Admin', 'Bakery', 'Bar', 'Cashier', 'Commissary', 'Dessert', 'FOH', 'Kitchen', 'Maintenance', 'Warehouse']
                        ).map(dept => (
                          <button
                            key={dept}
                            style={{
                              background: selectedInventoryDepartment === dept ? '#4A6741' : '#E8F5E8',
                              color: selectedInventoryDepartment === dept ? 'white' : '#4A6741',
                              border: '1px solid #9CAF88',
                              borderRadius: '8px',
                              padding: '10px 0',
                              width: '48%',
                              minWidth: '120px',
                              fontWeight: '600',
                              fontSize: '15px',
                              cursor: 'pointer',
                              boxShadow: selectedInventoryDepartment === dept ? '0 4px 12px #4A674140' : 'none',
                              transition: 'all 0.2s',
                              marginBottom: '6px',
                            }}
                            onClick={() => {
                              setSelectedInventoryDepartment(dept);
                              setShowCountedCheckedModal(true);
                              setShowInventoryModal(false);
                            }}
                          >{dept}</button>
                        ))}
                      </div>
                    </>
                  )}
                  {/* Cancel button replaced by X icon above */}
                </div>
              </div>
            )}
            {/* Counted By / Checked By Modal */}
            {showCountedCheckedModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.25)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                boxSizing: 'border-box',
              }}>
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px 12px',
                  width: '100%',
                  maxWidth: '370px',
                  boxShadow: '0 8px 32px rgba(74,103,65,0.18)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '18px',
                  position: 'relative',
                  minHeight: '220px',
                }}>
                  <h2 style={{ color: '#4A6741', fontWeight: 'bold', fontSize: '20px', marginBottom: '12px' }}>Enter Counted By & Checked By</h2>
                  <div style={{ width: '100%', marginBottom: '12px' }}>
                    <label style={{ fontWeight: '600', marginBottom: '6px', display: 'block', color: '#4A6741' }}>Counted By</label>
                    <input
                      type="text"
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #9CAF88', fontSize: '16px' }}
                      value={modalCountedBy}
                      onChange={e => setModalCountedBy(e.target.value)}
                      placeholder="Counted By"
                    />
                  </div>
                  <div style={{ width: '100%', marginBottom: '18px' }}>
                    <label style={{ fontWeight: '600', marginBottom: '6px', display: 'block', color: '#4A6741' }}>Checked By</label>
                    <input
                      type="text"
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #9CAF88', fontSize: '16px' }}
                      value={modalCheckedBy}
                      onChange={e => setModalCheckedBy(e.target.value)}
                      placeholder="Checked By"
                    />
                  </div>
                  <button
                    style={{
                      background: '#4A6741',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 32px',
                      fontWeight: '600',
                      fontSize: '16px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px #4A674140',
                      transition: 'all 0.2s',
                      marginTop: '8px',
                    }}
                    disabled={!modalCountedBy || !modalCheckedBy}
                    onClick={() => {
                      setShowCountedCheckedModal(false);
                      goToInventoryInput();
                    }}
                  >Next</button>
                </div>
              </div>
            )}
            {/* Warehouse Modal */}
            {showWarehouseModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.25)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                boxSizing: 'border-box',
              }}>
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 24px #0002',
                  padding: '2rem 2.5rem',
                  minWidth: '320px',
                  textAlign: 'center',
                  position: 'relative',
                }}>
                  <button
                    style={{
                      position: 'absolute',
                      top: '18px',
                      right: '18px',
                      background: 'none',
                      border: 'none',
                      fontSize: '22px',
                      color: '#4A6741',
                      cursor: 'pointer',
                      zIndex: 10,
                    }}
                    aria-label="Close"
                    onClick={() => setShowWarehouseModal(false)}
                  >
                    ×
                  </button>
                  <h2 style={{fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#4A6741'}}>Select Warehouse Group</h2>
                  <button onClick={() => handleWarehouseGroupSelect('RawMats')} style={{margin: '0.5rem', padding: '0.8rem 2rem', fontSize: '1.1rem', borderRadius: '8px', background: '#A3B18A', color: 'white', border: 'none', fontWeight: 600}}>RawMats</button>
                  <button onClick={() => {
                    setShowWarehouseModal(false);
                    window.location.href = '/warehouse-nonfood';
                  }} style={{margin: '0.5rem', padding: '0.8rem 2rem', fontSize: '1.1rem', borderRadius: '8px', background: '#A3B18A', color: 'white', border: 'none', fontWeight: 600}}>NonFood</button>
                </div>
              </div>
            )}

          </div>
    </div>
  );
}