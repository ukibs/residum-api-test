import { Connection } from "mariadb";
import { ServiceConnector } from "../contexts/domain/contracts/service-connector";
import { DatabaseError, Maybe } from "../contexts/domain/errors";
import { Clock } from "../contexts/domain/services/clock.service";

function alreadyHasOrderParameter(query: string, textToAdd: string) {
    return (
        query.includes("ASC") ||
        query.includes("DESC") ||
        textToAdd.includes("ASC") ||
        textToAdd.includes("DESC")
    );
}

export function addOrder(query: string, order: string, elements: string) {
    let textToReturn = "";
    const splitedElements = elements.split(",");
    //
    if (!query.includes("ORDER BY")) textToReturn = " ORDER BY";
    //
    for (let i = 0; i < splitedElements.length; i++) {
        //
        textToReturn +=
            (alreadyHasOrderParameter(query, textToReturn) ? ", " : " ") +
            splitedElements[i] +
            " " +
            order;
    }
    //
    return textToReturn;
}

//
export function getValuesAndKeysAsArray(object: unknown) {
    //
    const objectValuesArray = Object.values(object);
    const objectKeysArray = Object.keys(object);
    // const typesArray = Object.(object);
    //
    return {
        objectValuesArray,
        objectKeysArray,
    };
}

//
export function getValuesForInsertQuery(
    values: Array<unknown>,
    keys: Array<string>,
    dateFields?: Array<string>
) {
    const valuesToReturn: {
        values: unknown[];
        keys: string;
        interrogations: string;
    } = {
        values: [],
        keys: "",
        interrogations: "",
    };
    //
    for (let i = 0; i < values.length; i++) {
        // console.debug("Proccessing ", keys[i], " - ", values[i]);
        // && values[i] != null
        if (values[i] !== undefined && !Array.isArray(values[i])) {
            valuesToReturn.keys += keys[i] + ",";
            valuesToReturn.interrogations += "?,";

            if (dateFields && dateFields.includes(keys[i])) {
                valuesToReturn.values.push(Clock.getDateTime(values[i] as number));
            } else {
                valuesToReturn.values.push(values[i]);
            }
        }
    }
    //
    valuesToReturn.keys = valuesToReturn.keys.slice(0, -1);
    valuesToReturn.interrogations = valuesToReturn.interrogations.slice(0, -1);
    //
    return valuesToReturn;
}

//
export function getValuesForUpdateQuery(
    values: Array<unknown>,
    keys: Array<string>,
    dateFields: Array<string>,
    hasLastModifiedAt = true
) {
    const valuesToReturn: {
        values: unknown[];
        keys: string;
    } = {
        values: [],
        keys: "",
    };
    //
    for (let i = 0; i < values.length; i++) {
        // && values[i] != null
        // console.debug("Checking: ", keys[i], " - ", values[i]);
        if (values[i] !== undefined && !Array.isArray(values[i])) {
            valuesToReturn.keys += keys[i] + "=?,";

            if (dateFields.includes(keys[i]) && values[i] !== null) {
                valuesToReturn.values.push(Clock.getDateTime(values[i] as number));
            } else {
                valuesToReturn.values.push(values[i]);
            }
        }
    }
    //
    if (hasLastModifiedAt) {
        valuesToReturn.keys += "last_modified_at=?,";
        valuesToReturn.values.push(Clock.getDateTime(Clock.now()));
    }
    //
    valuesToReturn.keys = valuesToReturn.keys.slice(0, -1);
    //
    // console.debug("Values to return: ", valuesToReturn);
    return valuesToReturn;
}

//
export async function singularDatabaseOperation(
    databaseConnector: ServiceConnector<Connection>,
    query: string,
    values: Array<unknown>,
    errorMessage: string
): Promise<Maybe<any>> {
    const conn = await databaseConnector.getConnection();
    try {
        // 1. Start transaction.
        //await conn.beginTransaction();

        // 2. Make query
        let queryResult;
        if (values != null) queryResult = await conn.query(query, values);
        else queryResult = await conn.query(query);

        // 3. Commit transaction.
        //await conn.commit();

        // 4. Return te result - Some calls don't need to return it
        await conn.end();
        return [queryResult, null];
    } catch (e) {
        // Roll back transaction.
        console.debug("SQL error: ", e);
        // await conn.rollback();

        return [null, new DatabaseError(errorMessage)];
    } finally {
        // Terminate connection gracefully.
        // console.debug("Connection finally: ", conn);
        if (conn) await conn.end();
        // if (conn) conn.destroy();
        // console.debug("Connection destroyed: ", conn);
    }
}

//
export async function singularQuery(
    conn: Connection,
    query: string,
    values: Array<unknown>,
    errorMessage: string
): Promise<Maybe<any>> {
    try {
        // 1. Make query
        let queryResult;
        if (values != null) queryResult = await conn.query(query, values);
        else queryResult = await conn.query(query);

        // 2. Return te result - Some calls don't need to return it
        return [queryResult, null];
    } catch (e) {
        //
        console.debug("SQL error: ", e);

        console.debug("Error, destroying connection: ", conn);
        if (conn) await conn.end();
        //if (conn) conn.destroy();
        console.debug("Connection destroyed: ", conn);

        return [null, new DatabaseError(errorMessage)];
    }
}

//
export function convertObject(obj: any, keys: Array<string>): any {
    const convertedObj: any = {};

    keys.map((key) => {
        if (obj.hasOwnProperty(key)) {
            convertedObj[key] = obj[key];
        }
    });

    return convertedObj;
}

//
export function convertObjectExcludingFields(obj: any, keysToExclude: Array<string>): any {
    const objectToConvertKeys = Object.keys(obj);
    const convertedObj: any = {};

    objectToConvertKeys.map((key) => {
        if (!keysToExclude.includes(key)) {
            convertedObj[key] = obj[key];
        }
    });

    return convertedObj;
}

//
export function convertList(list: Array<any>, keys: Array<string>): Array<any> {
    const convertedList: any[] = [];

    list.map((item) => {
        convertedList.push(convertObject(item, keys));
    });

    return convertedList;
}

//
export function getAmountValuesToUse(orderValue: any) {
    //
    const objectToReturn = {
        amount: "0",
        commission: "0",
        premise_commission: "0",
        payment_type: "",
        payed_at: new Date(),
        transaction_id: "",
        first_payment: false,
        is_double_payment: false,
    };
    //
    console.debug("Selecting values - Order value: ", orderValue);
    //
    if (orderValue.type != "card" && orderValue.first_payment_type && !orderValue.payment_type) {
        objectToReturn.amount = orderValue.first_payment_amount;
        objectToReturn.commission = orderValue.first_payment_commission;
        objectToReturn.premise_commission = orderValue.first_payment_premise_commission;
        objectToReturn.payment_type = orderValue.first_payment_type;
        objectToReturn.payed_at = orderValue.first_payment_payed_at;
        objectToReturn.transaction_id = orderValue.first_payment_transaction_id;
        objectToReturn.first_payment = true;
        objectToReturn.is_double_payment = true;
    } else {
        objectToReturn.amount = orderValue.amount;
        objectToReturn.commission = orderValue.commission;
        objectToReturn.premise_commission = orderValue.premise_commission;
        objectToReturn.payment_type = orderValue.payment_type;
        objectToReturn.payed_at = orderValue.payed_at;
        objectToReturn.transaction_id = orderValue.transaction_id;
        //
        objectToReturn.is_double_payment = orderValue.first_payment_type;
    }
    //
    return objectToReturn;
}

//
export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//
export function checkAndPutWhereKeywordInQuery(query: string) {
    // Caso 1
    if (query.includes("AND") && !query.includes("WHERE")) {
        return query.replace("AND", "WHERE");
    }
    // Caso 2
    if (query.includes("AND") && query.includes("WHERE")) {
        const andIndex = query.indexOf("AND");
        const whereIndex = query.indexOf("WHERE");
        // Check if "AND" occurs before "WHERE"
        if (andIndex < whereIndex) {
            return query.replace("AND", "WHERE");
        }
    }
    //
    return query;
}

export function selectCurrencySymbol(currency: string) {
    console.debug("Checking currency: ", currency);
    const currencyLowerCase = currency ? currency.toLocaleLowerCase() : null;
    switch (currencyLowerCase) {
        case "gbp":
            return " £";
        case "usd":
            return " $";
        default:
            return " €";
    }
}
