#!/usr/bin/env bb

;; Babashka script to go through cloud functions json log and to check if:
;; has every insertLink call had an overlapping requestLink call?
;;
;; This was a one-off but saving for reference/starting point for future needs.

(require '[cheshire.core :as json])
(require '[clojure.string :as s])

(defn log-entry->event [e]
  (let [cfn-name (-> e :resource :labels :function_name)
        text (:textPayload e)
        execution (-> e :labels :execution_id)]
    (when (and (some? cfn-name)
               (some? text)
               (s/starts-with? text "Function execution"))
      {:timestamp (subs (:timestamp e) 0 22)
       :event (if (s/ends-with? text "started")
                 :start
                 :end)
       :function cfn-name
       :id execution
       :text (:textPayload e)})))

(defn s< [a b]
  (neg? (compare a b)))

(defn overlaps? [a b]
  ;; a period A overlaps with another if it starts before the other ends,
  ;; and other starts before A ends
  (and (s< (:start a) (:end b))
       (s< (:start b) (:end a))))


(defn pair->span [pair]
  (assert (every? map? pair) pair)
  (when (not= 2 (count pair))
    (throw (ex-info "not a pair" {:data pair})))
  (let [[a b] pair]
    (when (not= :start (:event a))
      (throw (ex-info "first ev not :start" {:data pair})))
    (when (not= :end (:event b))
      (throw (ex-info "second ev not :end" {:data pair})))
    {:function (:function a)
     :start (:timestamp a)
     :end (:timestamp b)}))

(defn events->spans [events]
  (let [by-id-pairs (mapv second
                          (group-by :id events))]
    (assert (every? map? events))
    (mapv pair->span by-id-pairs)))

(defn process [filename]
  (as-> filename x
    (slurp x)
    (json/parse-string x true)
    (keep log-entry->event x)))

(defn overlaps [needle haystack]
  (filterv #(and (overlaps? needle %) (not= needle %)) haystack))

;; overall dataflow:
;; 1. process fn: change GCP json log entries to event maps describing
;;    start or end of function execution, with :start or :end in the :event field.
;;    the json was filtered in the logs console to only have entries for
;;    the two interesting functons (insertLink and requestLink)
;; 2. events->spans fn: compute time span records from the above records
;; 3. go over spans and pass each to overlaps fn to check
;;      if other overlapping function executions of requestLink with it
(defn -main [filename]
  (let [events (process filename)
        spans (events->spans events)]
    (assert (every? map? spans))
    (doseq [s spans]
      (when (= (:function s) "insertLink")
        (println "overlaps for" s ":" (overlaps s spans))))))

(apply -main *command-line-args*)
