import ical from 'ical';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import {supabase} from "../src/supabaseClient.js";
import teachersData from '../src/data/teachers24-25-bbzw.json';
import subjectsData from '../src/data/subjects24-25-bbzw.json';

export async function generatePdf(user_id, form_data) {
    return  await getPdfData(user_id, form_data);
}

async function getPdfData(user_id, form_data) {
    const userData = await getUserData(user_id);
    const url = userData.calendar_url;
    const events = await getICALData(url);
    const date = new Date(form_data.date);
    getWeekday(date);
    const processedEvents = processEvents(events, date);
    const pdfForm = await fillForm(userData, processedEvents, form_data);
    const pdfBlob = new Blob([pdfForm], { type: 'application/pdf' });
    await savePdfInDB(pdfBlob, user_id, form_data.fileName, date, form_data.reason);
    return pdfBlob
}


async function getUserData(user_id) {
    const {data} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user_id)
        .single();
    return data;
}

async function getICALData(url) {
    try {
        const response = await fetch(`https://srv770938.hstgr.cloud:443/proxy?url=${url}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();

        const events = ical.parseICS(data);
        return events;

    } catch (error) {
        throw new Error(`Failed to fetch iCal data: ${error.message}`);
    }
}

function getWeekday(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}

function filterEventsByDate(events, filterDatum) {
    let array = [];
    for (const k in events) {
        if (events[k].type === 'VEVENT') {
            const date = new Date(events[k].start);
            if (
                date.getDate() === filterDatum.getDate() &&
                date.getMonth() === filterDatum.getMonth() &&
                date.getFullYear() === filterDatum.getFullYear()
            ) {
                let title = events[k].summary;
                let classe = extractClasse(title);
                let fach = title.split('-')[0];
                let teacher = title.split('-').pop();
                if(hasSpace(teacher) !== true) {
                    let realteacher = teacher.split(' ')[0];
                    let object = {datum: getFormattedDate(filterDatum), fach: fach, lehrer: realteacher, klasse: classe};
                    array.push(object);
                }


            }
        }
    }
    return array;
}


function getFormattedDate(date) {
    const options = { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('de-CH', options).replace(',', '');
    const [weekday, dayMonthYear] = formattedDate.split(' ');
    const [day, month, year] = dayMonthYear.split('.');
    const formattedWeekday = weekday.replace('.', '');

    return `${formattedWeekday}, ${day}.${month}.${year}`;
}

function hasSpace(str) {
    return str.includes(' ');
}

function removeDuplicatesWithCount(array) {
    const countMap = new Map();

    array.forEach(item => {
        const key = JSON.stringify(item);
        if (countMap.has(key)) {
            countMap.set(key, countMap.get(key) + 1);
        } else {
            countMap.set(key, 1);
        }
    });

    const result = [];
    countMap.forEach((count, key) => {
        const item = JSON.parse(key);
        item.count = count;
        result.push(item);
    });

    return result;
}

function processEvents(events, filterDatum) {
    const filteredEvents = filterEventsByDate(events, filterDatum);
    return removeDuplicatesWithCount(filteredEvents);
}

// To check the fields in the PDF
async function processPDF() {
    const formBytes = fs.readFileSync('Entschuldigung_Urlaubsgesuch_V2023_08_11.pdf');
    const pdfDoc = await PDFDocument.load(formBytes);
    const form = pdfDoc.getForm();
    form.getFields().forEach(f => {
        console.log(`${f.getName()} (${f.constructor.name})`);
    });
}

function formatBirthday(birthday) {
    const date = new Date(birthday);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

function getTeacherName(shortname) {
    return teachersData[shortname] || shortname;
}

function getSubjectName(shortSubjectName) {
    return subjectsData[shortSubjectName] || shortSubjectName;
}


async function fillForm(userData, processedEvents, form_data) {
    const date = new Date(form_data.date);
    const response = await fetch('/templates/Entschuldigung_Urlaubsgesuch_V2023_08_11.pdf');
    const formBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(formBytes);
    const form = pdfDoc.getForm();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const formattedDate = `${day}.${month}.${year}`;

    form.getTextField('Name und Vorname Lernender').setText(userData.last_name + ' ' + userData.first_name);
    form.getTextField('Geburtsdatum').setText(formatBirthday(userData.birthday));
    form.getTextField('Klasse').setText(processedEvents[0].klasse);
    form.getTextField('Datum der Absenz').setText(formattedDate);
    form.getTextField('Begründung der Absenzen Beim Urlaubsgesuch Beweismittel zwingend beilegen').setText(form_data.reason);

    form.getTextField('Name und Telefonnummer Berufsbildnerin').setText(userData.last_name_trainer + ' ' + userData.first_name_trainer + ' ' + userData.phone_number_trainer);
    form.getTextField('E-Mailadresse Berufsbildner/in').setText(userData.email_trainer);

    if(form_data.is_excused === true) {
        form.getCheckBox('undefined').check();
    }else {
        form.getCheckBox('undefined_2').check();
    }

    if (processedEvents.length > 0 && processedEvents.length <= 7) {
        for (let i = 0; i < processedEvents.length; i++) {
            const event = processedEvents[i];
            if(form_data.isFullNameEnabled === true) {
                event.lehrer = getTeacherName(event.lehrer);
            }
            if(form_data.isFullSubjectEnabled === true) {
                event.fach = getSubjectName(event.fach);
            }

            form.getTextField(`Anzahl LektionenRow${i + 1}`).setText(event.count.toString());
            form.getTextField(`Wochentag und Da tumRow${i + 1}`).setText(event.datum);
            form.getTextField(`FachRow${i + 1}`).setText(event.fach);
            form.getTextField(`LehrpersonRow${i + 1}`).setText(event.lehrer);
        }
    }

    return await pdfDoc.save();
}

async function savePdfInDB(pdfForm, userId, fileName, dateOfAbsence, reason) {
    if (!(await checkUserIdExists(userId))) return;

    const filePathBase = `${userId}/forms/`;
    const extensionIndex = fileName.lastIndexOf('.');
    const baseName = extensionIndex !== -1 ? fileName.substring(0, extensionIndex) : fileName;
    const extension = extensionIndex !== -1 ? fileName.substring(extensionIndex) : '';

    const { data: files, error } = await supabase.storage
        .from('pdf-files')
        .list(filePathBase);

    if (error) {
        console.error("Fehler beim Abrufen der Dateien:", error);
        return;
    }

    const existingNames = new Set(files.map(f => f.name));

    let counter = 0;
    let uniqueFileName;
    while (true) {
        uniqueFileName = counter === 0
            ? `${baseName}${extension}`
            : `${baseName} (${counter})${extension}`;

        if (!existingNames.has(uniqueFileName)) break;
        counter++;
    }

    const filePath = `${filePathBase}${uniqueFileName}`;
    const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('pdf-files')
        .upload(filePath, pdfForm, {
            metadata: {
                dateOfAbsence: dateOfAbsence
            }
        });

    const { error: dbError } = await supabase
        .from('pdf_files')
        .insert({
            user_id: userId,
            file_path: filePath,
            date_of_absence: dateOfAbsence,
            reason: reason,
            pdf_name: fileName
        })

    if (dbError) {
        console.error('Fehler beim Speichern der Metadaten:', dbError)
    }

    if (uploadError) {
        console.error("Fehler beim Hochladen:", uploadError);
    }
}



async function checkUserIdExists(userId) {
    const { error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

    return !error;

}
function extractClasse(title) {
        const matches = title.match(/[SWER]-[A-Z]+\d{2}[a-zA-Z]+(?:-LO)?/g);
        return matches ? matches.join(',') : '';
}
