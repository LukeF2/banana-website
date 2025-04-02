import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { format, isToday, isPast, isFuture, differenceInDays } from 'date-fns';
import { Calendar, CalendarPlus, X, Heart, Gift, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import the date picker CSS - we'll override some styles
import 'react-datepicker/dist/react-datepicker.css';

interface SpecialDate {
  id: number;
  date: Date;
  title: string;
  description: string;
  icon: 'heart' | 'gift' | 'star';
}

interface SerializedSpecialDate {
  id: number;
  date: string; // Date serialized as string
  title: string;
  description: string;
  icon: 'heart' | 'gift' | 'star';
}

export default function SpecialDates() {
  const [isOpen, setIsOpen] = useState(false);
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);
  const [newDate, setNewDate] = useState<Date | null>(new Date());
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newIcon, setNewIcon] = useState<'heart' | 'gift' | 'star'>('heart');
  const [isAdding, setIsAdding] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Load saved dates from localStorage on component mount
  useEffect(() => {
    setIsClient(true);
    const savedDates = localStorage.getItem('specialDates');
    if (savedDates) {
      // Convert string dates back to Date objects
      const parsedDates = JSON.parse(savedDates).map((date: SerializedSpecialDate) => ({
        ...date,
        date: new Date(date.date)
      }));
      setSpecialDates(parsedDates);
    }
  }, []);

  // Save dates to localStorage whenever they change
  useEffect(() => {
    if (isClient && specialDates.length > 0) {
      localStorage.setItem('specialDates', JSON.stringify(specialDates));
    }
  }, [specialDates, isClient]);

  const addSpecialDate = () => {
    if (newDate && newTitle.trim()) {
      const newSpecialDate: SpecialDate = {
        id: Date.now(),
        date: newDate,
        title: newTitle.trim(),
        description: newDescription.trim(),
        icon: newIcon
      };

      setSpecialDates([...specialDates, newSpecialDate]);

      // Reset form
      setNewTitle('');
      setNewDescription('');
      setNewIcon('heart');
      setIsAdding(false);
    }
  };

  const removeSpecialDate = (id: number) => {
    setSpecialDates(specialDates.filter(date => date.id !== id));
  };

  // Get the icon component based on the icon name
  const getIconComponent = (iconName: 'heart' | 'gift' | 'star', className = 'h-4 w-4') => {
    switch (iconName) {
      case 'heart':
        return <Heart className={className} />;
      case 'gift':
        return <Gift className={className} />;
      case 'star':
        return <Star className={className} />;
      default:
        return <Heart className={className} />;
    }
  };

  // Calculate days until date or days since date
  const getDaysText = (date: Date) => {
    if (isToday(date)) {
      return 'Today!';
    }

    const dayDiff = differenceInDays(date, new Date());

    if (isPast(date)) {
      return `${Math.abs(dayDiff)} days ago`;
    } else {
      return `${dayDiff} days from now`;
    }
  };

  const getDateColor = (date: Date) => {
    if (isToday(date)) return 'text-green-500';
    if (isPast(date)) return 'text-gray-400';
    return 'text-blue-500';
  };

  return (
    <div className="relative">
      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="notion-button flex items-center gap-2 mb-4"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <Calendar className="h-4 w-4" />
        {isOpen ? 'Hide Special Dates' : 'Show Special Dates'}
      </motion.button>

      {/* Special dates panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-light text-gray-700">special dates</h3>
                <button
                  onClick={() => setIsAdding(true)}
                  className="text-blue-500 hover:text-blue-600 flex items-center text-sm"
                >
                  <CalendarPlus className="h-4 w-4 mr-1" />
                  Add Date
                </button>
              </div>

              {/* Form to add a new date */}
              {isAdding && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Add special date</h4>
                    <button
                      onClick={() => setIsAdding(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Date</label>
                      <DatePicker
                        selected={newDate}
                        onChange={(date) => setNewDate(date)}
                        className="w-full p-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                        dateFormat="MMMM d, yyyy"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Title</label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Anniversary, Birthday, etc."
                        className="w-full p-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Description (optional)</label>
                      <input
                        type="text"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="A short description..."
                        className="w-full p-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Icon</label>
                      <div className="flex gap-2">
                        {['heart', 'gift', 'star'].map((icon) => (
                          <button
                            key={icon}
                            onClick={() => setNewIcon(icon as 'heart' | 'gift' | 'star')}
                            className={`p-2 rounded-md ${newIcon === icon ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          >
                            {getIconComponent(icon as 'heart' | 'gift' | 'star')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={addSpecialDate}
                        disabled={!newDate || !newTitle.trim()}
                        className="px-3 py-1.5 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Date
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* List of special dates */}
              {specialDates.length > 0 ? (
                <div className="space-y-2">
                  {specialDates
                    .sort((a, b) => {
                      // First sort by past (at the bottom) vs future (at the top)
                      if (isPast(a.date) && isFuture(b.date)) return 1;
                      if (isFuture(a.date) && isPast(b.date)) return -1;

                      // Then sort by closest date
                      const todayDiffA = Math.abs(differenceInDays(a.date, new Date()));
                      const todayDiffB = Math.abs(differenceInDays(b.date, new Date()));
                      return todayDiffA - todayDiffB;
                    })
                    .map((specialDate) => (
                      <div
                        key={specialDate.id}
                        className="p-3 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors relative group"
                      >
                        <button
                          onClick={() => removeSpecialDate(specialDate.id)}
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>

                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 p-1.5 rounded-full ${specialDate.icon === 'heart' ? 'bg-red-100 text-red-500' : specialDate.icon === 'gift' ? 'bg-purple-100 text-purple-500' : 'bg-yellow-100 text-yellow-500'}`}>
                            {getIconComponent(specialDate.icon)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-medium text-gray-800 truncate">
                                {specialDate.title}
                              </h4>
                              <span className={`text-xs ${getDateColor(specialDate.date)} ml-2`}>
                                {getDaysText(specialDate.date)}
                              </span>
                            </div>

                            {specialDate.description && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {specialDate.description}
                              </p>
                            )}

                            <p className="text-xs text-gray-400 mt-1">
                              {format(specialDate.date, 'MMMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-md">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No special dates yet.</p>
                  <p className="text-xs mt-1">Click "Add Date" to create your first one.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
