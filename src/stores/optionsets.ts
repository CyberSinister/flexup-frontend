import { computed, ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";

export const useOptionsetStore = defineStore("optionset", () => {
    const _countries =  ref({});
    const currencies = ref({});
    const units = ref({});
    
    const storedCountries = localStorage.getItem('countries');
    const storedCurrencies = localStorage.getItem('currencies');
    const storedUnits = localStorage.getItem('units');

    const fetchCountries = async () => {
        await ApiService.get('/option-sets/countries')
            .then(response => {
                console.log('Coutnries response: ', response)
                _countries.value = response.data;
                localStorage.setItem('countries', JSON.stringify(response.data));
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const fetchCurrencies = async () => {
        await ApiService.get('/option-sets/currencies')
            .then(response => {
                console.log('Currencies response: ', response)
                currencies.value = response.data;
                localStorage.setItem('currencies', JSON.stringify(response.data));
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        console.log('Currencies: ', currencies.value);
    };

    const fetchUnits = async () => {
        await ApiService.get('/option-sets/units')
            .then(response => {
                console.log('Units response: ', response)
                units.value = response.data;
                localStorage.setItem('units', JSON.stringify(response.data));
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        console.log('Units: ', units.value);
    };

    if (storedCountries) {
        _countries.value = JSON.parse(storedCountries);
    } else {
        fetchCountries();
    }

    if (storedCurrencies) {
        currencies.value = JSON.parse(storedCurrencies);
    } else {
        console.log('Countries not found')
        fetchCurrencies();
    }

    if (storedUnits) {
        units.value = JSON.parse(storedUnits);
    } else {
        console.log('Units not found')
        fetchUnits();
    }

    const getCountries = () => {
        const countriesDict = _countries.value;
        const sortedEntries = Object.entries(countriesDict).sort(([, a], [, b]) => {
            return a.name_long.localeCompare(b.name_long);
        });
    
        return sortedEntries.reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
    };

    const countries = computed(() => {
        const countriesDict = _countries.value;
        const sortedEntries = Object.entries(countriesDict).sort(([, a], [, b]) => {
            return a.name_long.localeCompare(b.name_long);
        });
    
        return sortedEntries.reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
    });

    const getCurrencies = () => {
        return currencies.value;
    }

    const getUnits = () => {
        return units.value;
    }
    // if (storedCurrencies) {
    //     currencies.value = JSON.parse(storedCurrencies);
    // } else {
    //     getCurrencies();
    // }

    // const selectDefaultCurrency = () => {
    //     console.log('called')
    //     console.log(country.value)
    //     if (country.value) {
    //         console.log("value")
    //         const selectedCountry = countries.value[country.value];
    //         console.log(selectedCountry)
    //         if (selectedCountry) {
    //             currency.value = selectedCountry.currency;
    //         }
    //     }
    // }

    return {
        countries, currencies, units, // selectDefaultCurrency
        getCountries, getCurrencies, getUnits,
    };
});
