(in-package :alu-test)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Table and Setup Swap
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(eval-when (:compile-toplevel :load-toplevel :execute)

  (defun clone (hash)
    (alexandria:plist-hash-table
     (alexandria:hash-table-plist hash)))
  (defparameter *test-functions* (clone storage:*functions*))

  (defparameter *test-types* (clone storage:*types*))

  (defparameter *swapped* (storage:currently-swapped?))

  (defun swap-tables ()
    (storage:swap-tables *test-functions*
                         *test-types*)))

;; We do this to ensure that the tables get swapped properly
(eval-when (:load-toplevel :execute)
  (swap-tables))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Examples in the test table
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(alu:deftype tree ()
  (element int)
  (left    tree)
  (nonce   tree))

(alu:deftype utx ()
  ;; replace with a string type once we get strings
  (owner  int)
  (amount (int   64))
  (nonce  (int   64)))

(alu:deftype point ()
  (x int)
  (y int))

(alu:deftype nested ()
  (plane point)
  (time  point))


(defcircuit constrain ((public nest nested)
                       (output void))
  (def ((plane (plane nest))
        (time  (time nest)))
    (prld:= (prld:* (x plane)
                    (y plane))
            (prld:+ (x time)
                    (y time)))))

(defcircuit use-constrain ((public foo nested)
                           (output void))
  (constrain foo))

(defcircuit arg-test-exp ((public  root int)
                          (private sig  int)
                          (private utx utx)
                          (output int))
  3)


(defcircuit arg-foo ((public  root int)
                     (private sig  int)
                     (private foo  int)
                     (output nested))
      3)

(defcircuit int-return  ((output int))
  3)

(defcircuit arg-circuit-input ((public  root int)
                               (private sig  point)
                               (output nested))
  (nested :plane sig :time sig))

(defcircuit record-test ((public  root int)
                         (private sig  int)
                         (private utx nested)
                         (output point))
  (arg-circuit-input 3 (plane utx)))

(defcircuit record-test-mult ((public  root int)
                              (private sig  int)
                              (private utx nested)
                              (output point))
  (def ((circ (arg-circuit-input 3 (plane utx))))
    (plane circ)))

(defcircuit record-ret ((public x int)
                        (public y int))
  (nested :plane (point :x x :y y)
          :time  (point :x x :y y)))

(defcircuit poly-check ((public x int)
                        (output bool))
  (prld:= (prld:+ (prld:exp x 3)
                  (prld:* 3 (prld:exp x 2))
                  (prld:* 2 x)
                  4)
     0))

(defcircuit invalid-type-unification ((public x (int 64))
                                      (public y (int 32))
                                      (output (int 64)))
  (prld:+ x y))

(defcircuit invalid-record-lookup ((output (int 64)))
  (x 3))

(defcircuit invalid-record-creation ((output (int 64)))
  (def ((y (ir:make-record :name :foo)))
    y))

(defcircuit invalid-record-primitive ((public x (int 32))
                                      (output (int 64)))
  (def ((y (prld:+ 3 x)))
    (x y)))

(defcircuit basic-unification ((public x (int 32))
                               (output (int 32)))
  (def ((y 55)
        (z (prld:+ 55 y y)))
    (prld:+ y x z)))

(defcircuit invalid-record-primitive-2 ((public x int)
                                        (output (int 64)))
  (def ((y (prld:+ 3 x)))
    (x y)))

(defcircuit invalid-record-lookup-type ((public ntest nested)
                                        (output (int 64)))
  (x ntest))

(defcircuit invalid-application-unification ((output (int 64)))
  (arg-circuit-input 35 35))

;; Manual adding to the storage
;; my god just add storage abstraction, as wew!
(storage:add-function
 :manual-constraint
 (ir:make-circuit
  :return-type (ir:make-type-reference :name :bool)
  :name :manual-constraint
  :arguments nil
  :body
  '(emit:instruction
    (ir:make-bind-constraint
     :var (list :a :b :c)
     :value
     (list
      (ir:make-let :var :fi
                    :val (ir:make-application
                          :function (ir:make-reference :name :record-test-mult)
                          :arguments
                          (list (ir:make-reference :name :hi)
                           (ir:make-reference :name :hi)
                           (ir:make-reference :name :hi))))
      (ir:make-application
       :function (ir:make-reference :name :=)
       :arguments
       (list
        (ir:make-application
         :function (ir:make-reference :name :+)
         :arguments
         (list (ir:make-reference :name :a)
               (ir:make-reference :name :b)
               (ir:make-reference :name :fi)
               (ir:make-record-lookup
                :record (ir:make-record :name :utxo
                                         :owner 3
                                         :amount 5
                                         :nonce (ir:make-reference :name :hi))
                :field :nonce)))
        (ir:make-reference :name :bob))))))))

(defcircuit array-lookup-equation ((public x (int 25))
                                   (output (int 25)))
  (def ((with-constraint (y z)
          (prld:= x (prld:+ (prld:* y 10) z))))
    z))

(defcircuit explicit-type-coercsion ((public x (int 64))
                                     (public y (int 32))
                                     (output (int 64)))
  (prld:+ x (prld:coerce y (int 64))))

(defcircuit explicit-type-check ((public x (int 64))
                                 (public y (int 32))
                                 (output (int 64)))
  (def ((z (prld:+ y (check 35 (int 32)))))
    (prld:+ x (prld:coerce z (int 64)))))

(defcircuit invalid-type-check ((public x (int 64))
                                (public y (int 32))
                                (output (int 64)))
  (def ((z (prld:+ y 35)))
    (prld:+ x (prld:check z (int 64)))))


(defcircuit array-type-check ((public arr (array 10 int))
                              (output (array int 10)))
  (def ((foo (prld:get arr 10)))
    (prld:+ 25 foo)))

(defcircuit invalid-array-type-check ((public arr (array 10 int))
                                      (output (array int 10)))
  (def ((foo (prld:get arr 10)))
    (prld:+ (prld:check 25 (int 64)) foo)))

(defcircuit array-creation-check ((output (array int 10)))
  (def ((foo (array 10 (int 32)))
        (bar (array 10 (int 32))))
    (setf (prld:get foo 0) (prld:check 23 (int 32)))
    (setf (prld:get foo 1) 25)
    (prld:+ 25 (prld:get foo 0) (prld:get foo 1))))

(defcircuit array-from-data-check ((output (array int 10)))
  (def ((foo 35)
        (bar (to-array foo 36)))
    (prld:+ (prld:check foo (int 32))
            (prld:get bar 0))))

(defcircuit array-from-data-check-consts ((output (array int 10)))
  (def ((bar (to-array 36)))
    (prld:+ (prld:check 5 (int 32))
            (prld:get bar 0))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Restoring the original table if we didn't start in the test table
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(unless *swapped*
  (storage:restore-tables))
