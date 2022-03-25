(in-package :alu.pass)

(defun pipeline (term)
  (~> term
      anf:normalize-expression
      linearize-lets))

;; TODO :: Make pass that expands away useless lets
;; thus a let :name = :name-calc
;; just rename all instances of :name into :name-calc from that point
;; forth



(-> linearize-lets (spc:term) spc:constraint-list)
(defun linearize-lets (term)
  "linearize-lets takes a `spc:term' in a flatten form, and removes the
`spc:let-node' for the more flat `spc:bind' type"
  (etypecase-of spc:term term
    ;; if it's just the term as is, then we are good
    (spc:term-no-binding
     (list term))
    ;; if it's a let-node we should change it
    (spc:let-node
     (with-accessors ((var spc:var) (val spc:value) (body spc:body)) term
       (cons (spc:make-bind :var var :val val)
             (linearize-lets body))))))
